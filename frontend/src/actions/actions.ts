const subjectsUrl = "/subjects/all";
const questionsUrl = "/questions/primary/";
const newQuestionUrl = "/questions/new";

export function getAllSubjectsAction() {
  return fetch(subjectsUrl)
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

export function getQuestionsAndAnswers(subjectId: number) {
  return fetch(questionsUrl + subjectId)
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

export function sendQuestion(question: any) {
  return fetch(newQuestionUrl, {
    method: "post",
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(question)
  });
}