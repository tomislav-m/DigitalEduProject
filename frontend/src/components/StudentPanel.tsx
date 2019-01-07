import React from 'react';
import { Button, Modal, Input, Icon, Loader, Dimmer, Dropdown, DropdownProps, Message, Grid } from 'semantic-ui-react';
import autobind from 'autobind-decorator';
import './styles.css';
import { Subject, Question } from '../containers/StudentPanelContainer';

interface IStudentPanelProps {
  answered: boolean;
  answer?: string;
  isAnswerWrong: boolean;
  subjects: Array<Subject>;
  questions: Array<Question>;
  onGetAnswer(question: string): void;
  onAnswerAction(correct: boolean): void;
  onSubjectChange(subjectId: number): void;
  onAskQuestion(subjectId: number, text: string): void;
}

interface IStudentPanelState {
  modalOpen: boolean;
  question: string;
  selectedSubject?: Subject;
}

export default class StudentPanel extends React.Component<IStudentPanelProps, IStudentPanelState> {
  constructor(props: IStudentPanelProps) {
    super(props);

    this.state = {
      modalOpen: false,
      question: ''
    };
  }

  @autobind
  private _handleModalClose() {
    this.setState({
      modalOpen: false
    });
  }

  @autobind
  private _handleModalOpen() {
    this.setState({
      modalOpen: true,
      question: ''
    });
  }

  @autobind
  private _handleInputChange(event: any) {
    this.setState({
      question: event.target.value
    });
  }

  @autobind
  private _onAnswer(isCorrect: boolean) {
    this._handleModalClose();
    this.props.onAnswerAction(isCorrect);
  }

  @autobind
  private _mapSubjectsToOptions() {
    const options = this.props.subjects.map(subject => {
      return {
        key: subject.Id,
        text: subject.Name,
        value: subject.Name
      };
    });
    return options;
  }

  @autobind
  private _onDropdownSelect(event: any, data: DropdownProps) {
    const subject = this.props.subjects.filter(x => x.Name === data.value)[0];
    if (subject) {
      this.props.onSubjectChange(subject.Id);
      this.setState({
        selectedSubject: subject
      });
    }
  }

  @autobind
  private _renderAnswerModal() {
    return (
      <Modal
        size='small'
        trigger={
          <Button
            color="green"
            disabled={this.state.question.length === 0}
            onClick={() => this.props.onGetAnswer(this.state.question)}
          >
            <Icon name="question" /> Ask
        </Button>
        }
      >
        <Modal.Header>Answer</Modal.Header>
        <Modal.Content>
          {
            this.props.answered &&
            <p className="description-text">
              {
                this.props.answer || "Nothing found..."
              }
            </p> ||
            <Dimmer active>
              <Loader> Searching for answer...</Loader>
            </Dimmer>
          }
        </Modal.Content>
        {
          this.props.answer && this.props.answered &&
          <Modal.Actions>
            <Button onClick={() => this._onAnswer(true)} color="green">
              <Icon name="checkmark" /> Thanks
            </Button>
            <Button onClick={() => this._onAnswer(false)} color="red">
              <Icon name="checkmark" /> This is not the answer I'm looking for
            </Button>
          </Modal.Actions>
        }
      </Modal>
    );
  }

  @autobind
  private _renderQuestionSent() {
    const { onAskQuestion } = this.props;
    const { question, selectedSubject } = this.state;
    const subjectId = selectedSubject ? selectedSubject.Id : 0;
    return (
      <Modal
        size='small'
        trigger={<Button color="green" onClick={() => onAskQuestion(subjectId, question)}><Icon name="send" /> Send</Button>}
      >
        <Modal.Header>Question sent</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <p className="description-text">
              Your question has been sent to the staff.
              You'll get a notification as soon as they answer to it.
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
  private _renderQuestions() {
    return (
      <div>
        {
          this.props.questions.map(q => {
            return (
              <Message
                header={q.Question}
                content={q.Answer}
              />
            )
          })
        }
      </div>
    );
  }

  public render() {
    return (
      <Grid className="container-student">
        <Grid.Row columns="2">
          <Grid.Column floated="right">
            <Dropdown
              placeholder="Select subject"
              search selection
              options={this._mapSubjectsToOptions()}
              onChange={this._onDropdownSelect}
              className="dropdown_select-subject"
            />
          </Grid.Column>
          <Grid.Column floated="left">
            {
              this.state.selectedSubject &&
              <div>
                <Modal
                  trigger={
                    <Button onClick={this._handleModalOpen} size="big" color="blue">
                      Ask a question
                    </Button>
                  }
                  size="small"
                  open={this.state.modalOpen}
                  onClose={this._handleModalClose}
                >
                  <Modal.Header>Ask a question</Modal.Header>
                  <Modal.Content>
                    <Modal.Description>
                      <p className="description-text">You've got a question? Fire away!</p>
                    </Modal.Description>
                    <Input placeholder="Question..." size="big" fluid onChange={this._handleInputChange} />
                  </Modal.Content>
                  <Modal.Actions>
                    {this._renderAnswerModal()}
                    <Button onClick={this._handleModalClose} color="red">
                      <Icon name="cancel" /> Cancel
                    </Button>
                  </Modal.Actions>
                </Modal>
                <Modal open={this.props.isAnswerWrong}>
                  <Modal.Header>Wrong answer?</Modal.Header>
                  <Modal.Content>
                    <Modal.Description>
                      <div className="description-text">
                        Not satisfied with the given answer?
                        Click "Send" to send your question to the staff or "Cancel" and try again.<br />
                        Your question was:<br />
                        <p className="answer-center"><strong>"{this.state.question}"</strong></p>
                      </div>
                    </Modal.Description>
                  </Modal.Content>
                  <Modal.Actions>
                    {this._renderQuestionSent()}
                    <Button onClick={() => this._onAnswer(true)} color="red">
                      <Icon name="cancel" /> Cancel
                </Button>
                  </Modal.Actions>
                </Modal>
              </div>
            }
          </Grid.Column>
        </Grid.Row>
        <Grid.Row centered columns="1">
          {
            this._renderQuestions()
          }
        </Grid.Row>
      </Grid>
    );
  }
}