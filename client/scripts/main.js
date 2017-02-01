import React from 'react'
import ReactDOM from 'react-dom'
import QRCode from 'qrcode.react'

import Peer from 'peerjs'
import randomID from 'random-id'

import {Ball, BallComponent} from './ball.js'

require('../styles/main.less')


class MainContainer extends React.Component {
  constructor(props) {
    super(props);
    this.balls = []
    this.state = {ballComponents: []}

    this.code = randomID(3, 'a')
    this.peer = new Peer(this.code, {
      host: location.hostname,
      port: 3000,
      secure: true,
      path: '/peerjs'
    })
    this.peer.on('connection', (conn) => {
      conn.on('open', () => {
        this.createBall(conn)
      })
    })
    this.peer.on('error', (err) => { alert(err) })

    for (var i = 0; i < 10; i++) {
      let debugBall = new Ball({conn: {peer: 'debug'+i, send:() => {}, on: () => {}}})
      debugBall.color = 'black'
      debugBall.mass = 10
      this.balls.push(debugBall)
    }
  }

  createBall(conn) {
    this.balls.push(new Ball({conn: conn}))
  }

  deleteInactiveBalls() {
    this.balls = this.balls.filter((b) => {return b.active})
  }

  checkCollision(b1, b2) {
    if (b1.mass == b2.mass) return
    if (b2.mass > b1.mass) {
      let tmp = b1
      b1 = b2
      b2 = tmp
    }
    // b1 is the biggest ball now

    let c1 = b1.getCenter(),
        c2 = b2.getCenter()
    let r1 = b1.getRadius(),
        r2 = b2.getRadius()

    let a = r1 > r2 ? r1 : r2,
        x = c1.x - c2.x,
        y = c1.y - c2.y;
    let d = Math.sqrt(x*x + y*y)
    if (d < r1) {
      // b1 eats b2
      b1.mass = b1.mass + b2.mass
      b2.active = false
    }
  }

  gameLoop() {
    this.deleteInactiveBalls()

    for (var i in this.balls)
      this.balls[i].updatePosition()

    for (var i = 0; i < this.balls.length-1; i++)
      for (var j = i + 1; j < this.balls.length; j++)
        this.checkCollision(this.balls[i], this.balls[j])


    let ballComponents = this.balls.map((b) => {
      return <BallComponent ball={b} key={b.conn.peer} />
    })
    this.setState({ballComponents: ballComponents})
    window.requestAnimationFrame(this.gameLoop.bind(this))
  }

  componentDidMount() {
    this.gameLoop()
  }

  render() {
    return (
      <div className="container">
        <div className="infobox">
          <h1>Players: {this.state.ballComponents.length}</h1>
          <a href={`https://${location.host}/mobile/#${this.code}`} target="_blank">
            <QRCode value={`https://${location.host}/mobile/#${this.code}`} /> <br />
            {`https://${location.host}/mobile/#${this.code}`}
          </a>
        </div>
        {this.state.ballComponents}
      </div>
    )
  }
}
ReactDOM.render(<MainContainer/>, document.getElementById('main-wrapper'));
