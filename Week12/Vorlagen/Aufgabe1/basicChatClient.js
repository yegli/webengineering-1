/* START API URL */
const NEW_CHAT_API_URL = new URL('/api/newChat', 'http://localhost:8080');
const GET_CHAT_API_URL = new URL('/api/getChat', 'http://localhost:8080');
const ADDTO_CHAT_API_URL = new URL('/api/addToChat', 'http://localhost:8080');
/* START API URL */

/* START HELPER FUNCTION */
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
/* START HELPER FUNCTION */


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

const getMessagesHtmlString = function() {
    return messages.map((message) => `<li>${message}</li>`).join('');
};



/* TODO: Implement application logic */
