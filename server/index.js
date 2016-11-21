const PORT = 3000;

var express = require('express');
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer();
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

/* WebServer */
app.use(express.static(__dirname + '/../client'));
app

/* if not production */
var bundle = require('./bundle.js');
bundle();
app.all('/dist/*', function (req, res) {
  proxy.web(req, res, {
      target: 'http://localhost:8080'
  });
});
proxy.on('error', function(e) {
  console.log('Could not connect to proxy, please try again...');
});

/* --- */

http.listen(PORT, function(){
  console.log('listening on *:'+PORT);
});

/* Socket manager */
var clients = {};
var getKeys = function(obj){
   var keys = [];
   for(var key in obj){
      if (obj[key] !== null) keys.push(key);
   }
   return keys;
}

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('a user disconnected');

    // se l'utente aveva un nickname associato, lo elimino
    for (var i in clients)
      if (clients[i] === socket) {
        clients[i] = null;
        io.emit('list update', getKeys(clients));
        break;
      }
  });

  socket.on('set nickname', function(msg){
    var nickname = msg.trim();
    if (clients[nickname]) {
      // already taken
      console.log('Username not available: ' + nickname);
      socket.emit('username already taken');
    }
    else if (!nickname) {
      console.log('Username invalid: ' + nickname);
      socket.emit('username invalid');
    }
    else {
      console.log('Succesfully logged in: ' + nickname);
      clients[nickname] = socket;
      socket.emit('username valid', nickname);

      // broadcast the new user logged in
      socket.on('list request', function() {
        socket.emit('list update', getKeys(clients));
      })
      socket.broadcast.emit('list update', getKeys(clients));

    }
  });

});
