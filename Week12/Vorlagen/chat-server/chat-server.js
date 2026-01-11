import http from 'http';
import url from 'url';
import staticServer from 'node-static';
import {Server} from 'socket.io';
import ListMap from './ListMap.js';

// server push see https://socket.io/get-started/chat/

const PORT = 8080;
const fileServer = new staticServer.Server();

const chatsDB = new Map();
let chatsCounter = 0; // bad idea -> vulnerability

const subscriptions = new ListMap();

function pushUpdateInfoToSubscribers(chatId) {
    const subscribers = subscriptions.getValueList(chatId);
    for (const {handle, socket} of subscribers) {
        socket.emit('chat updated', handle);
    }
}

function getNewChatId() {
    const nextChatCounter = ++chatsCounter;
    chatsDB.set(nextChatCounter, []);
    return nextChatCounter;
}

function getChat(chatId) {
    return chatsDB.get(chatId);
}

function addToChat(chatId, newMessage) {
    // only store last 10
    console.log('addToChat', chatId);
    const messages = chatsDB.get(chatId);
    if (messages) {
        const nineItems = messages.slice(-9);
        nineItems.push(newMessage);
        chatsDB.set(chatId, nineItems);
        pushUpdateInfoToSubscribers(chatId);
    }
}

function handleNewChat(req, res) {
    const chatId = getNewChatId();
    res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': req.headers.origin});
    res.end(JSON.stringify({chatId}));
}

function handleGetChat(req, res) {
    const queryString = url.parse(req.url).query;
    const queryParams = new URLSearchParams(queryString);
    const chatId = parseInt(queryParams.get('chat'), 10) || getNewChatId();
    const chat = getChat(chatId);
    if (chat) {
        res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': req.headers.origin});
        res.end(JSON.stringify(getChat(chatId)));
    } else {
        res.writeHead(404, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': req.headers.origin});
        res.end();
    }
}

function handleAddToChat(req, res) {
    const queryString = url.parse(req.url).query;
    const queryParams = new URLSearchParams(queryString);
    const chatId = parseInt(queryParams.get('chat'), 10);
    const message = queryParams.get('message');
    if (chatId) {
        addToChat(chatId, message);
    }
    res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': req.headers.origin});
    res.end(JSON.stringify(getChat(chatId)));
}

const routes = {
    '/api/newChat': handleNewChat,
    '/api/getChat': handleGetChat,
    '/api/addToChat': handleAddToChat,
};

function requestHandler(req, res) {
    const routeHandler = routes[url.parse(req.url).pathname];
    if (routeHandler) {
        routeHandler(req, res);
    } else {
        fileServer.serve(req, res);
    }
}

const httpServer = http.createServer(requestHandler);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }});

httpServer.listen(PORT, () => console.log('Node listening on Port ', PORT));

let connectionId = 0; // debug info

io.on('connection', (socket) => {
    const connectId = ++connectionId;
    console.log(`connection ${connectId} connected`);
    socket.on('disconnect', () => {
        console.log(`connection ${connectId} disconnected`);
    });
    socket.on('subscribe', ({chatId, handle}) => {
        console.log(`(Connection ${connectId}): User with handle ${handle} used connection to subscribe   to ${chatId}`);
        subscriptions.addToValueList(chatId, {connectId, handle, socket});
    });
});
