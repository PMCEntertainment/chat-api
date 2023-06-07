
const express = require('express');
 const app = express();
 const server = require('http').Server(app);
 const io = require('socket.io')(server);


 io.on('connection', socket => {
   console.log('A client connected.');


   socket.on('message', message => {
     console.log('Received message:', message);
     io.emit('message', message);
   });


   socket.on('disconnect', () => {
     console.log('A client disconnected.');
   });
 });

 
 const PORT = 3006;
 server.listen(PORT, () => {
   console.log(`Server started on port ${PORT}`);
 });
