import React from 'react';
import autobind from 'autobind-decorator';
import ProfessorPanel from '../../components/FAQ/ProfessorPanel';
import { getUnansweredQuestions, sendAnswer, sendAnswerDialogflow } from '../../actions/actions';
import { QuestionPost } from '../../data/DataStructures';

interface IProfessorState {
  questions?: Array<QuestionPost>;
}

export default class ProfessorPanelContainer extends React.Component<{}, IProfessorState> {
  public state: IProfessorState = {
    questions: undefined
  }

  public componentDidMount() {
    this._getQuestions();
  }

  @autobind
  private _getQuestions() {
    getUnansweredQuestions().then(questions => {
      this.setState({
        questions
      });
    });
  }

  @autobind
  private _sendAnswer(question: QuestionPost, answer: string) {
    sendAnswerDialogflow(question.SubjectId, question.Text, answer).then(() => {
      sendAnswer(question, answer).then(() => {
        this._getQuestions();
      });
    });
  }

  public render() {
    return (
      <ProfessorPanel
        questions={this.state.questions}
        onAnswer={this._sendAnswer}
      />
    );
  }
}