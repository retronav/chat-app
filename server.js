//router for server
var express = require('express')
var app = express()
var server = require('http').Server(app);
var io = require('socket.io').listen(server)
server.listen(process.env.PORT);
var users = {};
app.use('/app', express.static(__dirname + '/app'))
app.get('/', function(req, res){
  //serve our index.html
  res.sendFile(__dirname + '/app/index.html');
});
io.on('connection', function(socket){
  socket.on('new-user', function(user){
  users[socket.id] = user.name
  console.log(users[socket.id] + " connected");
  socket.broadcast.emit('user-connected', user)
  })
  socket.on('disconnect', function(){
    console.log(users[socket.id] + " disconnected");
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})
 //emit message
 io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});
