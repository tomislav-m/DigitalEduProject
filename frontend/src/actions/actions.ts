import { QuestionPost } from "../data/DataStructures";

const subjectsUrl = "/subjects/all";
const questionsUrl = "/questions/primary/";
const newQuestionUrl = "/questions/new";
const unansweredQuestionsUrl = "/questions/unanswered?id=";
const answerUrl = "/answers/new";
const editQuestionUrl = "/questions/edit/";
const answeredQuestionsUrl = "/questions/answered?username=";
const askQuestionUrl = "/dialogflow/ask?";
const checkQuestionUrl = "/dialogflow/check?";
const getQuestionUrl = "/dialogflow/question?";
const numQuestionUrl = "/dialogflow/num?";
const confirmAnswerUrl = "/dialogflow/confirm";
const markAsSeenUrl = "/questions/markasseen";

export function confirmAnswer(query: string, subjectId: number) {
  return fetch(confirmAnswerUrl, {
    method: "post",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question: query,
      subjectId
    })
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

export function numQuestion(subjectId: number) {
  return genericFetch(numQuestionUrl + `subjectId=${subjectId}`);
}

export function getQuestions(subjectId: number) {
  return genericFetch(getQuestionUrl + `subjectId=${subjectId}`);
}

export function checkQuestion(subjectId: number, question: string, answer: string) {
  return genericFetch(checkQuestionUrl + `subjectId=${subjectId}&question=${question}&answer=${answer}`);
}
const saveAnswerDialogflow = '/dialogflow/send';

export function askQuestion(subjectId: number, question: string) {
  return genericFetch(askQuestionUrl + `subjectId=${subjectId}&question=${question}`);
}

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

export function dismissNotification(id: number) {
  return fetch(markAsSeenUrl, {
    method: "put",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(id)
  });
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

export function sendAnswerDialogflow(subjectId: number, question: string, answer: string, existing: boolean) {
  return fetch(saveAnswerDialogflow, {
    method: "post",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      subjectId: subjectId,
      question: question,
      answer: answer,
      existing
    })
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