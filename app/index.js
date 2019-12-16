$(function () {
  function appendMsg(html, style){
    let div = document.createElement('div');
    div.id="msg-container"
    let msg = document.createElement('h1')
    msg.innerHTML = html
    msg.style.cssText = style
    let date = document.createElement('span')
    date.innerHTML = now.getHours() + ' : ' + now.getMinutes()
    date.style.float = 'right';
    msg.appendChild(date)
    div.appendChild(msg)
    $('#messages').append(div)
  }
    function randomColor(){
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
    var socket = io();
    var now = new Date();
    setInterval(()=>{now = new Date()}, 1000)
    var username = {
    name : prompt("What is your name??"),
    color : randomColor()
    };
    if(username.name === null || username.name === undefined || username.name === ''){
      username.name = 'User'+Math.floor(Math.random()*99999) 
    }
    socket.emit('new-user', username)
    
    $('form').submit(function(e){
      e.preventDefault(); // prevents page reloading
      socket.emit('chat message', {msg : $('#m').val(), user : username.name, color : username.color});
      $('#m').val('');
      return false;
    });
    socket.on('chat message', function(data){
      appendMsg(data.user + ' : ' + data.msg , 'color : '+data.color);
    });
      socket.on('user-connected', function(data){
      $('#messages').append($('<h1>').append('<span>').text(data.name + ' connected'));
      });
      socket.on('user-disconnected', function(name){
      $('#messages').append($('<h1>').append('<span>').text(name + ' disconnected'));
      })
      socket.on('connect', function(data){
      $('#messages').append($('<h1>').append('<span>').text('You connected'));
      });
  });