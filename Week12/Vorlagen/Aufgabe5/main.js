import http from 'http';
import url from 'url';
import staticServer from 'node-static';

let counter = 0;

const ROUTE = {
  '/api/counter': incrementCounter
}

function incrementCounter(req, res) {
  console.log('increment counter');
  const result = {
    counter: counter++,
  };
  res.writeHead(200, {
    'Content-Type': 'application/json',
    // 'Access-Control-Allow-Origin': `http://localhost:4000`, // Teil 2
    // 'Access-Control-Allow-Origin': '*', // Teil 3
  });
  res.end(JSON.stringify(result));
}

const PORT = 3000;
const PORT2 = 4000;

const fileServer = new staticServer.Server('./pub');
const server = new http.createServer((req, res) => {
  const route = ROUTE[url.parse(req.url).pathname];
  if (route) {
    route(req, res);
  } else {
    fileServer.serve(req, res);
  }
});

server.listen(PORT, () => {
  console.log('Server listens on PORT: ', PORT);
});


const fileServer2 = new staticServer.Server('./pub');
const server2 = new http.createServer((req, res) => {
    fileServer2.serve(req, res);
});
server2.listen(PORT2, () => {
  console.log('Server listens on PORT: ', PORT2);
});
