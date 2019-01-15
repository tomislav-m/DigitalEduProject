import React from 'react';
import autobind from 'autobind-decorator';
import StudentPanel from '../../components/FAQ/StudentPanel';
import { getAllSubjectsAction, getQuestionsAndAnswers, sendQuestion, askQuestion, confirmAnswer } from '../../actions/actions';
import '../../components/FAQ/styles.css';
import { Subject, Question, QuestionPost } from '../../data/DataStructures';

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
  private _getAnswer(subjectId: number | undefined, question: string) {
    if (this.state.answered) return;
    subjectId && askQuestion(subjectId, question).then(answer => {
      this.setState({
        answer,
        answered: true
      });
    });
  }

  @autobind
  private _markAnswer(isCorrect: boolean, query: string) {
    isCorrect && query.length > 0 && confirmAnswer(query);
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