import React from 'react';
import autobind from 'autobind-decorator';
import ProfessorPanel from '../components/ProfessorPanel';
import { getUnansweredQuestions, sendAnswer } from '../actions/actions';
import { QuestionPost } from '../data/DataStructures';

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
    sendAnswer(question, answer).then(() => {
      this._getQuestions();
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