const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();

const app = express();

app.use(express.static(__dirname + '/node_modules')); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

const server = app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);

const io = require('socket.io')(server);


const game = require('./game.js')
io.sockets.on('connection', function(socket) {
  console.log('client connected');
  socket.on('disconnect', function() {
    console.log("client disconnected");
  });

  socket.on('username', (userName) => {
    console.log(userName);
  })
});
