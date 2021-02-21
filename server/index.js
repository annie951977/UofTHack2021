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


function updateScores(users, socketId, firstPlace, avg, playerCount) {
  const scores = [];
  scores.push({
    userName: users[socketId].userName + " (you)",
    score: users[socketId].score
  });

  // if there is only one player, send [you]
  if (playerCount == 1)
    return scores;

  if (firstPlace == socketId) {
    secondPlace = null;
    for (const [iterSocketId, {userName, score}] of Object.entries(users)) {
      if (iterSocketId == socketId) {continue;}

      if (secondPlace == null) {
        secondPlace = iterSocketId;
      }
      else if (score > users[secondPlace]) {
        secondPlace = iterSocketId;
      }
    }
    firstPlace = secondPlace;
  }

  scores.push({
    userName: users[firstPlace].userName,
    score: users[firstPlace].score
  });

  // if there are only two players, send [you, firstPlace]
  if (playerCount == 2) {
    return scores;
  }

  
  // if there are only three players, send [you, firstPlace, otherPlayer]
  if (playerCount == 3) {
    for (const [iterSocketId, {userName, score}] of Object.entries(users)) {
      if (iterSocketId != socketId && iterSocketId != firstPlace)
        scores.push({
          userName: userName,
          score: score
        });
    }
  } 
  
  // if there are more than three players, send [you, firstPlace, avg]
  else {
    scores.push({
      userName: "Average",
      score: avg
    });
  }

  return scores;
}

function calcNewAvg(prevAvg, oldScore, newScore, playerCount) {
  return ((prevAvg * playerCount) - oldScore + newScore / playerCount);
}

const game = require('./game.js')
var users = {};
var firstPlace = null;
var avg = 0;
var playerCount = 0;
io.sockets.on('connection', function(socket) {
  console.log('client connected');
  socket.on('disconnect', function() {
    delete users[socket.id];
    playerCount--;
    console.log("client disconnected: " + socket.id);
    console.log(users);
  });

  socket.on('sendUsername', (userName) => {
    console.log('New user joined: ' + socket.id);
    avg = (avg * playerCount) / (playerCount + 1);
    users[socket.id] = {
      userName: userName,
      score: 0
    };
    playerCount++;
    if (firstPlace == null) {
      firstPlace = socket.id
    }
    
    for (const [iterSocketId, {userName, score}] of Object.entries(users)) {
      socket.to(iterSocketId).emit('scoresUpdated', {scores: updateScores(users, iterSocketId, firstPlace, avg, playerCount)});
    }
    socket.emit('scoresUpdated', {scores: updateScores(users, socket.id, firstPlace, avg, playerCount)});
  });
  socket.on('updateMyScore', (newTotal) => {
    avg = calcNewAvg(avg, users[socket.id].score, newTotal, playerCount);
    users[socket.id].score = newTotal;
    if (newTotal > users[firstPlace].score) {
      firstPlace = socket.id;
    }
    for (const [iterSocketId, {userName, score}] of Object.entries(users)) {
      socket.to(iterSocketId).emit('scoresUpdated', {scores: updateScores(users, iterSocketId, firstPlace, avg, playerCount)});
    }
    console.log('Updated score: ' + newTotal);
    socket.emit('scoresUpdated', {scores: updateScores(users, socket.id, firstPlace, avg, playerCount)});
  });

  socket.on('iWon', () => {
    socket.broadcast.emit('someoneWon');
  })
});
