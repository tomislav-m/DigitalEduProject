import React from 'react';
import autobind from 'autobind-decorator';
import ProfessorPanel from '../components/ProfessorPanel';
import { getUnansweredQuestions } from '../actions/actions';
import { QuestionPost } from '../data/DataStructures';

interface IProfessorState {
  questions: Array<QuestionPost>;
}

export default class ProfessorPanelContainer extends React.Component<{}, IProfessorState> {
  public state: IProfessorState = {
    questions: []
  }

  public componentWillMount() {
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

  public render() {
    return (
      <ProfessorPanel
        questions={this.state.questions}
      />
    );
  }
}