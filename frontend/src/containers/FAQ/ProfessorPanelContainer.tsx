import React from 'react';
import autobind from 'autobind-decorator';
import ProfessorPanel from '../../components/FAQ/ProfessorPanel';
import { getUnansweredQuestions, sendAnswer, sendAnswerDialogflow } from '../../actions/actions';
import { QuestionPost } from '../../data/DataStructures';

interface IProfessorState {
  unansweredQuestions?: Array<QuestionPost>;
}

export default class ProfessorPanelContainer extends React.Component<{}, IProfessorState> {
  public state: IProfessorState = {
    unansweredQuestions: undefined
  }

  public componentDidMount() {
    this._getQuestions();
  }

  @autobind
  private _getQuestions() {
    getUnansweredQuestions().then(unansweredQuestions => {
      this.setState({
        unansweredQuestions
      });
    });
  }

  @autobind
  private _sendAnswer(question: QuestionPost, answer: string, existing: boolean) {
    sendAnswerDialogflow(question.SubjectId, question.Text, answer, existing).then(() => {
      sendAnswer(question, answer).then(() => {
        this._getQuestions();
      });
    });
  }

  public render() {
    return (
      <ProfessorPanel
        questions={this.state.unansweredQuestions}
        onAnswer={this._sendAnswer}
      />
    );
  }
}