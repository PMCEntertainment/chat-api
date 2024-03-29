/*
 *   Copyright (c) 2023 Phuong My Chi Entertainment Co.,Ltd
 *   All rights reserved.

 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at

 *   http://www.apache.org/licenses/LICENSE-2.0

 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

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
const urlAllow = "https://chat.phuongmychi.vn"

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
  res.setHeader("Content-Type", "application/json");
  // res.send(req.body);
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
  res.setHeader("Access-Control-Allow-Origin",  urlAllow);
  res.setHeader("Server", "gws");
  res.setHeader("X-Powered-By", "Phuong My Chi Entertainment");
  res.json({"msg":"hiii"});
});

// get msg
app.get('/v1/messages', (req, res) => {
  res.setHeader("Content-Type", "application/json");
  // res.send(req.body);
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
  res.setHeader("Access-Control-Allow-Origin", urlAllow);
  res.setHeader("Server", "gws");
  res.setHeader("X-Powered-By", "Phuong My Chi");
  res.json(messages);
});

// send msg
app.post('/v1/messages', (req, res) => {
  const { content, sender } = req.body;
  res.setHeader("Content-Type", "application/json");
  // res.send(req.body);
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
  res.setHeader("Access-Control-Allow-Origin", urlAllow );
  res.setHeader("Server", "gws");
  res.setHeader("X-Powered-By", "Phuong My Chi Entertainment");
  const newMessage = { content, sender };

  messages.push(newMessage);
  io.emit('message', newMessage);

  res.status(201).json(newMessage);
});

const port = 8080; 
server.listen(port, () => {
  console.log(`Socket server is running on port ${port}`);
});
