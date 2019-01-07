import React from 'react';
import autobind from 'autobind-decorator';
import { askQuestion } from '../data/Answers';
import StudentPanel from '../components/StudentPanel';
import { getAllSubjectsAction, getQuestionsAndAnswers, sendQuestion } from '../actions/actions';
import '../components/styles.css';
import { Subject, Question, QuestionPost } from '../data/DataStructures';

interface IStudentState {
  answer?: string;
  answered: boolean;
  isAnswerWrong: boolean;
  subjects: Array<Subject>;
  questions: Array<Question>;
}

export default class StudentPanelContainer extends React.Component<{}, IStudentState> {
  public state: IStudentState = {
    answered: false,
    isAnswerWrong: false,
    subjects: [],
    questions: []
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

  @autobind
  private _onSubjectChange(id: number) {
    getQuestionsAndAnswers(id).then((questions: Array<Question>) => {
      this.setState({
        questions
      });
    });
  }
  
  @autobind
  private _onQuestionSend(subjectId: number, question: string) {
    const questionPost: QuestionPost = {
      SubjectId: subjectId,
      AskedBy: 1,
      Primary: false,
      Text: question
    };
    sendQuestion(questionPost);
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
          questions={this.state.questions}
          onSubjectChange={this._onSubjectChange}
          onAskQuestion={this._onQuestionSend}
        />
      </div>
    );
  }
}