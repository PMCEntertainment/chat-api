
// https://api-chat.phuongmychi.vn/v1
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// save user connecting
let connectedUsers = [];

// save msg
let messages = [];

io.on('connection', socket => {
  console.log('A user connected');

  socket.on('join', username => {
    const user = { id: socket.id, username };
    connectedUsers.push(user);
    io.emit('users', connectedUsers);
    console.log(`${username} joined the chat`);
  });

  socket.on('message', message => {
    messages.push(message);
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    connectedUsers = connectedUsers.filter(user => user.id !== socket.id);
    io.emit('users', connectedUsers);
    console.log('A user disconnected');
  });
});

app.use(express.json());

app.get('/v1', (req, res) => {
  res.json({"msg":"hiii"});
});
// get msg
app.get('/v1/messages', (req, res) => {
  res.json(messages);
});

// send msg
app.post('/v1/messages', (req, res) => {
  const { content, sender } = req.body;
  const newMessage = { content, sender };

  messages.push(newMessage);
  io.emit('message', newMessage);

  res.status(201).json(newMessage);
});

const port = 8080; 
server.listen(port, () => {
  console.log(`Socket server is running on port ${port}`);
});
