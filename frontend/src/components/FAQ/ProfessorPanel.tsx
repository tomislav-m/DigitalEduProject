import React from 'react';
import { Container, Segment, Button, Icon, Loader, Modal, Input } from 'semantic-ui-react';
import { QuestionPost } from '../../data/DataStructures';
import autobind from 'autobind-decorator';

interface IProfessorProps {
  questions?: Array<QuestionPost>;
  onAnswer(question: QuestionPost | undefined, answer: string): void;
}

interface IProfessorState {
  modalOpen: Array<boolean>;
  answer: string;
}

export default class ProfessorPanel extends React.Component<IProfessorProps, IProfessorState> {
  constructor(props: IProfessorProps) {
    super(props);

    this.state = {
      modalOpen: [false],
      answer: ''
    };
  }

  @autobind
  private _handleInputChange(event: any) {
    this.setState({
      answer: event.target.value
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
  private _handleModalOpen(index: number) {
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
  private _renderResponseModal(question: QuestionPost | undefined) {
    const { onAnswer } = this.props;
    const { answer } = this.state;
    return (
      <Modal
        size='small'
        trigger={<Button color="green" onClick={() => onAnswer(question, answer)}><Icon name="send" /> Send</Button>}
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
          <Button floated="right" color="green" onClick={() => this._handleModalOpen(index)}>
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
          <Input placeholder="Answer..." size="big" fluid onChange={this._handleInputChange} />
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
                  {q.Text}
                  {this._renderAnswerModal(q, index)}
                </Segment>
              );
            })
        }
      </Container>
    );
  }
}