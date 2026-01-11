import dataService from './data-service.js';

const postsList = document.getElementById('posts-list');
const nameInput = document.getElementById('name-input');
const postTitleInput = document.getElementById('post-title-input');
const newPostForm = document.getElementById('new-post-form');

const newCommentPostIdSpan = document.getElementById('new-comment-post-id-span');
const commentBodyInput = document.getElementById('comment-body-input');
const newCommentForm = document.getElementById('new-comment-form');

function createPostCommentsHtml(comments, postId) {
  const postComments = comments
    .filter((comment) => comment.postId === postId)
    .map((comment) => `<li>${comment.body}<button data-action="delete-comment" data-comment-id="${
      comment.id}">Delete Comment</button></li>`)
    .join('');
  return (postComments) ? `<ul>${postComments}</ul>` : '';
}

async function renderPosts() {
  const posts = await dataService.getPosts();
  const comments = await dataService.getComments();
  const postsHtml = posts
    .filter((post) => post.title)
    .map((post) => `<li>(${post.id}) <em>${post.title}</em> (${
      post.author}) <button data-action="add-comment" data-post-id="${post.id}">Add Comment</button>${
      createPostCommentsHtml(comments, post.id)}</li>`)
    .join('');
  postsList.innerHTML = postsHtml;
}

async function submitPostHandler(event) {
  event.preventDefault();
  await dataService.submitPost({title: postTitleInput.value, author: nameInput.value});
  renderPosts();
}

newPostForm.addEventListener('submit', submitPostHandler);

function handlePostsListItemActions(event) {
  if (event.target.nodeName === 'BUTTON') {
    if (event.target.dataset.action === 'add-comment') {
      const {postId} = event.target.dataset;
      newCommentForm.hidden = false;
      newCommentPostIdSpan.textContent = postId;
      commentBodyInput.value = '';
    }
    if (event.target.dataset.action === 'delete-comment') {
      const {commentId} = event.target.dataset;
      dataService.deleteComment(commentId);
      renderPosts();
    }
  }
}

postsList.addEventListener('click', handlePostsListItemActions);

async function submitCommentHandler(event) {
  event.preventDefault();
  console.log('click');
  await dataService.submitComment(
    {body: commentBodyInput.value, postId: Number(newCommentPostIdSpan.innerText)},
  );
  newCommentForm.hidden = true;
  renderPosts();
}

newCommentForm.addEventListener('submit', submitCommentHandler);

renderPosts();
