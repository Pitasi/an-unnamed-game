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
  }

  createBall(conn) {
    this.balls.push(new Ball({conn: conn}))
  }

  deleteBalls() {
    this.balls = this.balls.filter((b) => {return b.active})
  }

  gameLoop() {
    this.deleteBalls()
    let ballComponents = this.balls.map((b) => {
      b.updatePosition()
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
