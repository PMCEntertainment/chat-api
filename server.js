
const express = require('express');
 const app = express();
 const server = require('http').Server(app);
 const io = require('socket.io')(server);
const bodyParser = require('body-parser');
 app.use(bodyParser.json());

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



 
 app.post('/api/message', (req, res) => {
   const message = req.body.message;
   console.log('Received API message:', message);
   io.emit('message', message);
   res.json({ success: true });
 });
 
 const PORT = 3006;
 server.listen(PORT, () => {
   console.log(`Server started on port ${PORT}`);
 });
