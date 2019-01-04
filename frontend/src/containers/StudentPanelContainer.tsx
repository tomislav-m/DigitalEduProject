import React from 'react';
import autobind from 'autobind-decorator';
import { askQuestion } from '../data/Answers';
import StudentPanel from '../components/StudentPanel';
import { getAllSubjectsAction } from '../actions/actions';
import '../components/styles.css';

export interface Subject {
  Id: number;
  Name: string;
}

interface IStudentState {
  answer?: string;
  answered: boolean;
  isAnswerWrong: boolean;
  subjects: Array<Subject>;
}

export default class StudentPanelContainer extends React.Component<{}, IStudentState> {
  public state: IStudentState = {
    answered: false,
    isAnswerWrong: false,
    subjects: []
  }

  public componentWillMount() {
    this._getSubjects();
  }

  @autobind
  private _getSubjects() {
    getAllSubjectsAction().then((subjects: Array<Subject>) => {
      this.setState({ subjects });
    });
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
      <div className="container-student">
        <StudentPanel
          answer={this.state.answer}
          answered={this.state.answered}
          isAnswerWrong={this.state.isAnswerWrong}
          onAnswerAction={this._markAnswer}
          onGetAnswer={this._getAnswer}
          subjects={this.state.subjects}
        />
      </div>
    );
  }
}