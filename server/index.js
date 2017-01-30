const PORT = 3000;

var express = require('express');
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer();
var app = express();
var fs = require('fs');

/* SSL */
var ssl_option = {}
try {
  ssl_option = {
    key: fs.readFileSync('/etc/letsencrypt/live/game.zaph.pw/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/game.zaph.pw/fullchain.pem')
  }
}
catch (err) {
  ssl_option = {
    key: fs.readFileSync('certs/privkey.key'),
    cert: fs.readFileSync('certs/mycert.cert')
  }
}
var https = require('https').Server(ssl_option, app);
/* */

/* if not production */
var bundleClient = require('./bundle-client.js');
var bundleMobile = require('./bundle-mobile.js');
bundleClient();
bundleMobile();
/* */

var ExpressPeerServer = require('peer').ExpressPeerServer
app.use('/peerjs', ExpressPeerServer(https))

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

https.listen(PORT, function(){
  console.log('listening on *:'+PORT);
});
