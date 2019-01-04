const subjectsUrl = "/subjects/all";

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