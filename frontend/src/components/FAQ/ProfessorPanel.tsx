import React from 'react';
import { Container, Segment, Button, Icon, Loader, Modal, Input, Dropdown, DropdownProps } from 'semantic-ui-react';
import { QuestionPost, Question } from '../../data/DataStructures';
import autobind from 'autobind-decorator';
import { getQuestions, getQuestionsAndAnswers } from '../../actions/actions';

interface IProfessorProps {
  questions?: Array<QuestionPost>;
  onAnswer(question: QuestionPost | undefined, answer: string, existing: boolean): void;
}

interface IProfessorState {
  modalOpen: Array<boolean>;
  answer: string;
  existingAnswer: boolean;
  questionsAndAnswers: Array<any>;
}

export default class ProfessorPanel extends React.Component<IProfessorProps, IProfessorState> {
  constructor(props: IProfessorProps) {
    super(props);

    this.state = {
      modalOpen: [false],
      answer: '',
      existingAnswer: false,
      questionsAndAnswers: []
    };
  }

  @autobind
  private _handleInputChange(event: any) {
    this.setState({
      answer: event.target.value
    });
  }

  @autobind
  private _onDropdownSelect(event: any, data: DropdownProps) {
    const answer = data.value as string;
    this.setState({
      answer
    });
  }

  @autobind
  private _handleModalClose() {
    const modalOpen = this.state.modalOpen.map(x => x ? x = false : x);
    this.setState({
      modalOpen
    });
  }

  @autobind
  private _handleModalOpen(index: number, subjectId: number) {
    this._getAnswers(subjectId);
    const modalOpen = this.state.modalOpen;
    modalOpen[index] = true;
    this.setState({
      modalOpen,
      answer: ''
    });
  }

  @autobind
  private _onAnswer(isCorrect: boolean) {
    this._handleModalClose();
  }

  @autobind
  private _onTickPrimary(question: QuestionPost) {
    question.Primary = !question.Primary;
  }

  @autobind
  private _onChangeInputType() {
    const existingAnswer = !this.state.existingAnswer;
    this.setState({
      existingAnswer
    });
  }

  @autobind
  private _mapAnswersToOptions() {
    const options = this.state.questionsAndAnswers.map((question: any) => {
      return {
        key: question.QuestionId,
        text: question.Answer,
        value: question.Answer
      };
    });
    return options;
  }

  @autobind
  private _getAnswers(id: number) {
    getQuestionsAndAnswers(id).then((questions) => {
      this.setState({
        questionsAndAnswers: questions
      });
    });
  }

  @autobind
  private _renderResponseModal(question: QuestionPost | undefined) {
    const { onAnswer } = this.props;
    const { answer } = this.state;
    return (
      <Modal
        size='small'
        trigger={<Button color="green" onClick={() => onAnswer(question, answer, this.state.existingAnswer)}><Icon name="send" /> Send</Button>}
      >
        <Modal.Header>Answer sent</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <p className="description-text">
              Your answer has been sent.
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" onClick={() => this._onAnswer(true)}>
            <Icon name="checkmark" /> Got it!
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  @autobind
  private _renderAnswerModal(question: QuestionPost | undefined, index: number) {
    return (
      <Modal
        size="small"
        trigger={
          <Button floated="right" color="green" onClick={() => this._handleModalOpen(index, question!.SubjectId)}>
            <Icon name="exclamation" /> Answer
          </Button>
        }
        open={this.state.modalOpen[index]}
        onClose={this._handleModalClose}
      >
        <Modal.Header>Answer</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            {
              question &&
              <p className="description-text">
                {question.Text}
                {
                  <span className="checkbox-primary">
                    <Input type="checkbox" onChange={() => this._onTickPrimary(question)} input={question.Primary} title="primary" />
                  </span>
                }
              </p>
            }
          </Modal.Description>
          {
            !this.state.existingAnswer &&
            <Input placeholder="Answer..." size="medium" fluid onChange={this._handleInputChange} type="" />
          }
          {
            this.state.existingAnswer &&
            <Dropdown
              placeholder="Answer..."
              search selection fluid
              options={this._mapAnswersToOptions()}
              onChange={this._onDropdownSelect}
            />
          }
          <Button color="blue" onClick={this._onChangeInputType}>
            <Icon name="exchange" /> { this.state.existingAnswer ? "Type your answer" : "Pick existing answer"}
          </Button>
        </Modal.Content>
        <Modal.Actions>
          {this._renderResponseModal(question)}
          <Button onClick={this._handleModalClose} color="red">
            <Icon name="cancel" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  public render() {
    const { questions } = this.props;
    return (
      <Container className="question-center">
        {
          questions === undefined ?
            <div>
              <br />
              <Loader active={true} size="big">Loading questions...</Loader>
            </div> :
            questions.map((q, index) => {
              return (
                <Segment key={index} className="question-center" clearing>
                  {q.Text} ({(q as any).Subject.Name})
                  {this._renderAnswerModal(q, index)}
                </Segment>
              );
            })
        }
      </Container>
    );
  }
}