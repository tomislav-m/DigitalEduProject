import React from 'react';
import { Container, Segment, Button, Icon, Loader, Modal, Input } from 'semantic-ui-react';
import { QuestionPost } from '../../data/DataStructures';
import autobind from 'autobind-decorator';

interface IProfessorProps {
  questions?: Array<QuestionPost>;
  onAnswer(question: QuestionPost | undefined, answer: string): void;
}

interface IProfessorState {
  modalOpen: boolean;
  answer: string;
}

export default class ProfessorPanel extends React.Component<IProfessorProps, IProfessorState> {
  constructor(props: IProfessorProps) {
    super(props);

    this.state = {
      modalOpen: false,
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
    this.setState({
      modalOpen: false
    });
  }

  @autobind
  private _handleModalOpen() {
    this.setState({
      modalOpen: true,
      answer: ''
    });
  }

  @autobind
  private _onAnswer(isCorrect: boolean) {
    this._handleModalClose();
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
  private _renderAnswerModal(question: QuestionPost | undefined) {
    return (
      <Modal
        size="small"
        trigger={
          <Button floated="right" color="green" onClick={this._handleModalOpen}>
            <Icon name="exclamation" /> Answer
          </Button>
        }
        open={this.state.modalOpen}
        onClose={this._handleModalClose}
      >
        <Modal.Header>Answer</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <p className="description-text">{question && question.Text}</p>
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
            <Loader active={true} size="big">Loading answers...</Loader> :
            questions.map((q, index) => {
              return (
                <Segment key={index} className="question-center" clearing>
                  {q.Text}
                  {this._renderAnswerModal(q)}
                </Segment>
              );
            })
        }
      </Container>
    );
  }
}