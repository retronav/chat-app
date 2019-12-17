//router for server
var express = require('express')
var app = express()
var server = require('http').Server(app);
var io = require('socket.io').listen(server)
server.listen(process.env.PORT);
//server.listen(80)
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
  io.emit('user-online', 'There are currently '+Object.keys(users).length+' online')
})
  socket.on('disconnect', function(){
    console.log(users[socket.id] + " disconnected");
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
    io.emit('user-online', 'There are currently '+Object.keys(users).length+' online')
  })
})
 //divert again, emit message
 io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});
