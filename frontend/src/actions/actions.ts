import { QuestionPost } from "../data/DataStructures";

const subjectsUrl = "/subjects/all";
const questionsUrl = "/questions/primary/";
const newQuestionUrl = "/questions/new";
const unansweredQuestionsUrl = "/questions/unanswered?id=";
const answerUrl = "/answers/new";
const editQuestionUrl = "/questions/edit/";
const answeredQuestionsUrl = "/questions/answered?username=";

export function getAllSubjectsAction() {
  return genericFetch(subjectsUrl);
}

export function getQuestionsAndAnswers(subjectId: number) {
  return genericFetch(questionsUrl, subjectId);
}

export function getUnansweredQuestions(subjectId?: number) {
  return genericFetch(unansweredQuestionsUrl, subjectId);
}

export function getNotifications(username: string) {
  return genericFetch(answeredQuestionsUrl, username);
}

export function sendQuestion(question: any) {
  return fetch(newQuestionUrl, {
    method: "post",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(question)
  });
}

export function sendAnswer(question: QuestionPost, answer: string) {
  return fetch(answerUrl, {
    method: "post",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: question.Id,
      text: answer
    })
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      throw new Error(res.statusText);
    })
    .then(data => {
      question.AnswerId = data.Id;
      return editQuestion(question);
    })
    .catch(err => {
      return err;
    });
}

export function editQuestion(question: QuestionPost) {
  return fetch(editQuestionUrl + question.Id, {
    method: "put",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(question)
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      throw new Error(res.statusText);
    })
    .then(data => {
      return data;
    })
    .catch(err => {
      return err;
    });
}

function genericFetch(url: string, param: any = '') {
  return fetch(url + param)
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      throw new Error(res.statusText);
    })
    .then(data => {
      return data;
    })
    .catch(err => {
      return err;
    });
}