import React from 'react';
import autobind from 'autobind-decorator';
import { getQuestions } from '../data/Questions';
import ProfessorPanel from '../components/ProfessorPanel';

interface IProfessorState {
  questions: Array<string>;
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
    const questions = getQuestions();

    this.setState({
      questions
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