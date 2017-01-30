var fs = require('fs');
var peer = require('peer')
var PeerServer = peer.PeerServer({
  port: 3000,
  ssl: {
    key: fs.readFileSync('/etc/letsencrypt/live/game.zaph.pw/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/game.zaph.pw/fullchain.pem')
  },
  path: '/peerjs',
  proxied: true
});

PeerServer.on('connection', (id) => {console.log(`New connection. Id: ${id}`)})
