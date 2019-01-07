const subjectsUrl = "/subjects/all";
const questionsUrl = "/questions/primary/";
const newQuestionUrl = "/questions/new";
const unansweredQuestionsUrl = "/questions/unanswered?id=";

export function getAllSubjectsAction() {
  return genericFetch(subjectsUrl);
}

export function getQuestionsAndAnswers(subjectId: number) {
  return genericFetch(questionsUrl, subjectId);
}

export function getUnansweredQuestions(subjectId?: number) {
  return genericFetch(unansweredQuestionsUrl, subjectId);
}

export function sendQuestion(question: any) {
  return fetch(newQuestionUrl, {
    method: "post",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(question)
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
    });;
}