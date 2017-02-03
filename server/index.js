const PORT = 3000;

var express = require('express');
var app = express();
var compress = require('compression');
app.use(compress());
var fs = require('fs');
var path = require('path');

/* SSL */
var ssl_option = {}
switch (process.env.NODE_ENV) {
  case 'production':
    ssl_option = {
      key: fs.readFileSync('/etc/letsencrypt/live/game.zaph.pw/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/game.zaph.pw/fullchain.pem')
    }
    break
  default:
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
app.use('/favicon.ico', express.static(path.resolve('dist/assets/favicon.ico')))
app.use('/assets', express.static(path.resolve('dist/assets')))

app.get('/', (req, res) => {
  // https://gist.github.com/christopherdebeer/1200142
  var ua = req.header('user-agent');
  if(/mobile/i.test(ua)) {
    res.sendFile(path.resolve('dist/mobile/index.html'))
  } else {
    res.sendFile(path.resolve('dist/desktop/index.html'))
  }
})

app.get('/bundle.min.js', (req, res) => {
  var ua = req.header('user-agent');
  if(/mobile/i.test(ua)) {
    res.sendFile(path.resolve('dist/mobile/bundle.min.js'))
  } else {
    res.sendFile(path.resolve('dist/desktop/bundle.min.js'))
  }
})
/* --- */

https.listen(PORT, function(){
  console.log('listening on *:'+PORT);
});
