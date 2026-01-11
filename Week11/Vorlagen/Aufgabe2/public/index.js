import dataService from './data-service.js';

const postsList = document.getElementById('posts-list');
const nameInput = document.getElementById('name-input');
const postTitleInput = document.getElementById('post-title-input');
const newPostForm = document.getElementById('new-post-form');

function createPostCommentsHtml(comments, postId) {
  const postComments = comments.filter((comment) => comment.postId === postId).map((comment) => `<li>${comment.body}</li>`).join('');
  return (postComments) ? `<ul>${postComments}</ul>` : '';
}

async function renderPosts() {
  const posts = await dataService.getPosts();
  const comments = await dataService.getComments();
  const postsHtml = posts
    .filter((post) => post.title)
    .map((post) => `<li data-post-id="${post.id}">(${post.id}) <em>${post.title}</em> (${
      post.author})${createPostCommentsHtml(comments, post.id)}</li>`).join('');
  postsList.innerHTML = postsHtml;
}

async function submitPostHandler(event) {
  event.preventDefault();
  await dataService.submitPost({title: postTitleInput.value, author: nameInput.value});
  await renderPosts();
}

newPostForm.addEventListener('submit', submitPostHandler);

renderPosts();
