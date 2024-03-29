import React from 'react';
import { Subject } from '../../data/DataStructures';
import autobind from 'autobind-decorator';
import { getAllSubjectsAction, numQuestion, getQuestions, checkQuestion } from '../../actions/actions';
import { DropdownProps, Dropdown, Input, Segment, Button, Icon, Loader } from 'semantic-ui-react';
import './styles.css';

interface Question {
  Id: string;
  Question: string;
  Answer: string;
  Correct?: boolean;
  Loading: boolean;
}

interface ITaskState {
  subjects: Array<Subject>;
  selectedSubject?: Subject;
  threshold: number;
  numberOfQuestions: number;
  questions?: Array<Question>;
}

export default class AAOEQ extends React.Component<{}, ITaskState> {
  public state: ITaskState = {
    subjects: [],
    threshold: 0.5,
    numberOfQuestions: 0
  };

  public componentWillMount() {
    this._getSubjects();
  }

  @autobind
  private _getSubjects() {
    getAllSubjectsAction().then((subjects: Array<Subject>) => {
      subjects = subjects.filter(x => x.Name != "General");
      this.setState({ subjects });
    });
  }

  @autobind
  private _onSubjectChange(id: number) {
    getQuestions(id).then(questions => {
      this.setState({
        questions
      });
    })
  }

  @autobind
  private _onDropdownSelect(event: any, data: DropdownProps) {
    this.setState({ questions: undefined });
    const subject = this.state.subjects.filter(x => x.Name === data.value)[0];
    if (subject) {
      this._onSubjectChange(subject.Id);
      this.setState({
        selectedSubject: subject
      });
    }
  }

  @autobind
  private _mapSubjectsToOptions() {
    const options = this.state.subjects.map(subject => {
      return {
        key: subject.Id,
        text: subject.Name,
        value: subject.Name
      };
    });
    return options;
  }

  @autobind
  private _onThresholdChange(event: any) {
    const threshold = event.target.value / 10;
    this.setState({
      threshold
    });
  }

  @autobind
  private _onAnswerChange(event: any, id: string) {
    if (!this.state.questions) return;
    const questions = this.state.questions.slice();
    const question = questions.filter(x => x.Id === id)[0];
    question.Answer = event.target.value;
    this.setState({
      questions
    });
  }

  @autobind
  private _checkAnswer(id: string) {
    if (!this.state.questions) return;
    const questions = this.state.questions.slice();
    const question = questions.filter(x => x.Id === id)[0];
    question.Loading = true;
    this.setState({
      questions
    });
    const subject = this.state.selectedSubject;
    if (subject && question){
      checkQuestion(subject && subject.Id, id, question.Answer).then((confidence: number) => {
        question.Correct = confidence >= this.state.threshold ? true : false;
        question.Loading = false;
        this.setState({
          questions
        });
      });
    }
  }

  public render() {
    return (
      <div>
        <Dropdown
          placeholder="Select subject"
          search selection
          options={this._mapSubjectsToOptions()}
          onChange={this._onDropdownSelect}
          className="dropdown_select-subject"
        />
        <br />
        <Input type="range" min={0} max={10} onChange={this._onThresholdChange} />
        <span>{this.state.threshold}</span>
        
        {this.state.selectedSubject && this.state.questions === undefined ?
          <Loader active={true} size="big">Loading questions...</Loader> :
          this.state.questions && this.state.questions.map(q => {
          return (
            <Segment key={q.Id} clearing>
              {q.Question}
              <br /><br />
              <Input onChange={() => this._onAnswerChange(event, q.Id)} input={q.Answer} className="answer-input" />
              <Button floated="right" color="green" onClick={() => this._checkAnswer(q.Id)} loading={q.Loading}>
                Check
              </Button>
              {
                q.Correct === true &&
                <Icon name="checkmark" color="green" />
              }
              {
                q.Correct === false &&
                <Icon name="x" color="red" />
              }
            </Segment>
          );
        })}
      </div>
    );
  }
}