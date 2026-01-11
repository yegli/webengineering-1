import dataService from './data-service.js';

//
// todo Extend this SPA so that users can add comments and delete comments
//
// - extend index.html to create a second form for submitting comments which is shown when
//   users hit the (to be added) "add comment" button after a post.
// - Extend template to add a "Delete Comment" button after each comment.
// - Use data-... attributes to let the bubbling event-handler know what
//   the action should be and what post/comment the requested action relates to
// - Create the necessary dataService functions: submitComment, deleteComment.
//

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
