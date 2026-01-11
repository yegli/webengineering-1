import http from 'http';
import staticServer from 'node-static';
import url from 'url';

const PORT = 3000;
const fileServer = new staticServer.Server('./pub');

let counter = 1;
const database = [];
const ROUTES = {
    '/api/todo': {
        'GET': getAllTodos,
        'POST': newTodo,
        'DELETE': deleteTodoById
    },
};

function newTodo(req, res) {
    console.log('create new todo');
    let body = '';
    req.on('data', (chunk) => body += chunk);
    req.on('end', () => {
        const todo = { id: counter++, value: JSON.parse(body).value };
        database.push(todo);
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(201);
        res.end(JSON.stringify(todo));
    });
}

function getAllTodos(req, res) {
    console.log('get all todos');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(database));
}

function deleteTodoById(req, res) {
    const id = parseInt(new url.URL(req.url, `http://${req.headers.host}`).searchParams.get('id'));

    const index = database.findIndex(todo => todo.id === id);
    if (index == -1) {
        res.writeHead(404);
    } else {
        res.writeHead(200);
        database.splice(index, 1);
    }

    res.end();
}

const server = http.createServer((req, res) => {
    const pathname = url.parse(req.url).pathname;

    const route = ROUTES[pathname];
    if (!route) {
        fileServer.serve(req, res);
        return;
    }

    const handler = route[req.method];
    if (!handler) {
        res.writeHead(405);
        res.end()
        return;
    }
    route[req.method](req, res);
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Website: http://localhost:${PORT}/01-todo-mvc-solution.html`);
});
