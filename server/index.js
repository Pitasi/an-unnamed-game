const PORT = 3000;

var express = require('express');
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer();
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

/* if not production */
var bundleClient = require('./bundle-client.js');
var bundleMobile = require('./bundle-mobile.js');
bundleClient();
bundleMobile();
/* */

app.all('/dist/*', function (req, res) {
  proxy.web(req, res, {
      target: 'http://localhost:49152'
  });
});
app.all('/mobile/dist/*', function (req, res) {
  proxy.web(req, res, {
      target: 'http://localhost:49153'
  });
});
proxy.on('error', function(e) {
  console.log('Could not connect to proxy, please try again...');
});

/* WebServer */
app.use(express.static(__dirname + '/../client'));
app.use('/mobile', express.static(__dirname + "/../mobile"));

/* --- */

http.listen(PORT, function(){
  console.log('listening on *:'+PORT);
});

/* Socket manager */

var actives = {
  //code: {client: socketclient, mobile: socketmobile}
}

io.on('connection', (socket) => {
  socket.on('generate', () => {
    // generacodice
    // invia codice a socket
    // actives[code] = {client: socket}
  })

  socket.on('handshake', (code) => {
    // cellulare invia codice
    // se actives[code]: actives[code]['mobile'] = socket
    // invio errore/ok
  })

  socket.on('update', (v) => {socket.broadcast.emit('update', v)})
  socket.on('gyro', (o) => {socket.broadcast.emit('gyro', o)})
})
