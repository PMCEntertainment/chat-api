
const express = require('express');
 const app = express();
// const server = require('http').Server(app);
 const io = require('socket.io')(server);
const bodyParser = require('body-parser');
 app.use(bodyParser.json());
let port = 8080;
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

app.get('/api/test', (req, res) => {
   const message = req.body.message;
   
   res.send({ success: true });
 });

 
 app.post('/api/message', (req, res) => {
   const message = req.body.message;
   console.log('Received API message:', message);
   io.emit('message', message);
   res.json({ success: true });
 });
 app.listen(port, (err) => {
  if (err) throw err;
  console.log(`The app is booming on the legendary port ${port}`);
});
module.exports = app;
 
