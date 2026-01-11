const NEW_CHAT_API_URL = new URL('/api/newChat', 'http://localhost:8080');
const GET_CHAT_API_URL = new URL('/api/getChat', 'http://localhost:8080');
const ADDTO_CHAT_API_URL = new URL('/api/addToChat', 'http://localhost:8080');

const getNewChatId = function() {
    return getJSON(NEW_CHAT_API_URL); //improve: not defensive
};

const getChat = function(chatId) {
    return getJSON(GET_CHAT_API_URL + `?chat=${chatId}`);
};

const addToChat = function(chatId, message) {
    return getJSON(ADDTO_CHAT_API_URL + `?chat=${chatId}&message=${message}`);
};

const getJSON = function(url) {
    return fetch(url).then(response => (response.ok) ? response.json() : Promise.reject());
};

window.dataService = {getNewChatId, addToChat, getChat};

const handleInputElement = document.getElementById('handle-input');
const startChatSection = document.getElementById('start-chat-section');
const startNewChatBtn = document.getElementById('start-new-chat-btn');
const startNewChatForm = document.getElementById('start-new-chat-form');
const joinChatBtn = document.getElementById('join-chat-btn');
const joinChatForm = document.getElementById('join-chat-form');
const joinChatInputElement = document.getElementById('join-chat-input');
const joinErrorDisplay = document.getElementById('join-error-display');
const chattingSection = document.getElementById('chatting-section');
const handleOutput = document.getElementById('handle-output');
const chatIdOutput = document.getElementById('chat-id-output');
const messagesListElement = document.getElementById('messages-list');
const messageInputElement = document.getElementById('message-input');
const sendMessageBtn = document.getElementById('send-message-btn');
const sendMessageForm = document.getElementById('send-message-form');

const STATE_STARTING = 'state-starting';
const STATE_CHATTING = 'state-chatting';

let messages = [];

let state = STATE_STARTING;
let chatId = 0;
let joinError = false;
let handle = '';
let nextMessage = '';

const getMessagesHtmlString = function() {
    return messages.map((message) => `<li>${message}</li>`).join('');
};

const updateView = function() {
    if (state === STATE_STARTING) {
	startChatSection.hidden = false;
	chattingSection.hidden = true;
	startNewChatBtn.disabled = (handle === '');
	joinChatBtn.disabled = (handle === '' || chatId === 0);
	joinErrorDisplay.hidden = !joinError;
    } else {
	startChatSection.hidden = true;
	chattingSection.hidden = false;
	messagesListElement.innerHTML = getMessagesHtmlString();
	handleOutput.textContent = handle;
	chatIdOutput.textContent = chatId;
	sendMessageBtn.disabled = (nextMessage === '');
	messageInputElement.focus();
    }
};

handleInputElement.addEventListener('input', () => {
    handle = handleInputElement.value;
    updateView();
});

const updateChatFromServer = async function () {
    console.log("updateChatFromServer");
    messages = await dataService.getChat(chatId);
    updateView();
}

const joinChat = async function(event) {
    event.preventDefault(); // stay on page
    try{
	joinError = false;
	messages = await dataService.addToChat(chatId, `${handle} joined chat`);
	state = STATE_CHATTING;
	setInterval(updateChatFromServer, 10000);
    }catch{
	joinError = true;
    }
    updateView();
};
joinChatForm.addEventListener('submit', joinChat);

const startNewChat = async function(event) {
    event.preventDefault(); // stay on page
    chatId = (await dataService.getNewChatId()).chatId;
    console.log(chatId);
    await joinChat(event);
};
startNewChatForm.addEventListener('submit', startNewChat);

joinChatInputElement.addEventListener('input', () => {
    chatId = parseInt(joinChatInputElement.value) || 0;
    joinError = false;
    updateView();
});

messageInputElement.addEventListener('input', () => {
    nextMessage = messageInputElement.value;
    updateView();
});

const addMessageToChat = async function(event) {
    event.preventDefault(); // stay on page
    messageInputElement.value = '';
    messageInputElement.focus();
    messages = await dataService.addToChat(chatId, handle + ' : ' + nextMessage);
    updateView();
};
sendMessageForm.addEventListener('submit', addMessageToChat);

updateView();
