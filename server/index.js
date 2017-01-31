const PORT = 3000;

var express = require('express');
var app = express();
var compress = require('compression');
app.use(compress());
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
  // Fallback to a self-signed cert
  ssl_option = {
    key: fs.readFileSync('certs/privkey.key'),
    cert: fs.readFileSync('certs/mycert.cert')
  }
}
var https = require('https').Server(ssl_option, app);
/* */

var ExpressPeerServer = require('peer').ExpressPeerServer
app.use('/peerjs', ExpressPeerServer(https))

/* WebServer */
app.use(express.static(__dirname + '/../client'));
app.use('/dist/bundle.js', express.static(__dirname + '/../dist/client.min.js'))
app.use('/mobile', express.static(__dirname + "/../mobile"));
app.use('/mobile/dist/bundle.js', express.static(__dirname + '/../dist/mobile.min.js'))
/* --- */

https.listen(PORT, function(){
  console.log('listening on *:'+PORT);
});
