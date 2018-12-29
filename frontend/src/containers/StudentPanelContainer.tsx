import React from 'react';
import autobind from 'autobind-decorator';
import { askQuestion } from '../data/Answers';
import StudentPanel from '../components/StudentPanel';

interface IStudentState {
  answer?: string;
  answered: boolean;
  isAnswerWrong: boolean;
}

export default class StudentPanelContainer extends React.Component<{}, IStudentState> {
  public state: IStudentState = {
    answered: false,
    isAnswerWrong: false
  }

  @autobind
  private _getAnswer(question: string) {
    if (this.state.answered) return;
    const answer = askQuestion(question);

    setTimeout(() => {
      this.setState({
        answer,
        answered: true
      })
    },
      2000);
  }

  @autobind
  private _markAnswer(isCorrect: boolean) {
    this.setState({
      isAnswerWrong: !isCorrect,
      answered: false
    });
  }

  public render() {
    return (
      <StudentPanel
        answer={this.state.answer}
        answered={this.state.answered}
        isAnswerWrong={this.state.isAnswerWrong}
        onAnswerAction={this._markAnswer}
        onGetAnswer={this._getAnswer}
      />
    );
  }
}