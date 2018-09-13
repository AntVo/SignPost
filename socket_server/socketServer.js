var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);



// Main
app.get('/', function(req, res){
  res.sendFile(__dirname + '/server.html');
});

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('emitAudio', function(msg){
  	console.log(msg);
    io.emit('emitAudio', msg);
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
// Main