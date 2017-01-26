const PORT = 3000;

var express = require('express');
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer();
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

/* WebServer */
app.use(express.static(__dirname + '/../client'));
app.use("/mobile", express.static(__dirname + "/../mobile"));

/* if not production */
var bundleClient = require('./bundle-client.js');
var bundleMobile = require('./bundle-mobile.js');
bundleClient();
bundleMobile();

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

/* --- */

http.listen(PORT, function(){
  console.log('listening on *:'+PORT);
});

/* Socket manager */
io.on('connection', (socket) => {
  socket.on('update', (val) => {
    io.emit('update', val)
  })
})
