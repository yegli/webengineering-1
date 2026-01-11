const postsRESTServerURL = 'http://localhost:3000/';
const postsRoute = 'posts';
const commentsRoute = 'comments';

async function getJson(url) {
  const response = await fetch(url);
  return response.json();
}

async function postJson(url, json) {
  const response = await fetch(url, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(json),
  });
  return response.json();
}

async function getPosts() {
  return getJson(postsRESTServerURL + postsRoute);
}

async function getComments() {
  return getJson(postsRESTServerURL + commentsRoute);
}

async function submitPost(post) {
  return postJson(postsRESTServerURL + postsRoute, post);
}

export default {getPosts, getComments, submitPost};
