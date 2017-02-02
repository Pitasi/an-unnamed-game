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

    var audio = new Audio('../sound/welcome.mp3');
    audio.play();

    this.balls = []
    this.food = []
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
        conn.on('error', (e) => {console.error(e)})
      })
    })
    this.peer.on('error', (err) => { alert(err) })

    setInterval(this.spawnFoods.bind(this), 3000)
  }

  createBall(conn) {
    this.balls.push(new Ball({player: true, conn: conn}))
  }

  deleteInactiveBalls() {
    this.balls = this.balls.filter((b) => {return b.active})
    this.food = this.food.filter((b) => {return b.active})
  }

  spawnFoods() {
    let maxFood = 10
    if (this.food.length == maxFood) return
    for (var i = 0; i < maxFood - this.food.length; i++) {
      let f = new Ball({player: false})
      f.mass = 10
      this.food.push(f)
    }
  }

  checkCollision(b1, b2) {
    if (b2.mass > b1.mass) {
      let tmp = b1
      b1 = b2
      b2 = tmp
    }
    // b1 is the biggest ball now
    if (b1.mass < b2.mass+b2.mass*0.25) return

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
      b1.setMass(b2.mass/2)
      b2.active = false
    }
  }

  gameLoop() {
    this.deleteInactiveBalls()

    for (var i in this.balls)
      this.balls[i].updatePosition()

    let foodAndBalls = this.food.concat(this.balls)
    for (var i = 0; i < foodAndBalls.length-1; i++)
      for (var j = i + 1; j < foodAndBalls.length; j++)
        this.checkCollision(foodAndBalls[i], foodAndBalls[j])

    let ballComponents = this.balls.map((b) => {
      return <BallComponent ball={b} key={b.conn.peer} />
    })

    let foodComponents = this.food.map((b, i) => {
      return <BallComponent ball={b} key={'food'+i} />
    })

    this.setState({
      ballComponents: ballComponents,
      foodComponents: foodComponents
    })
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
        {this.state.foodComponents}
      </div>
    )
  }
}
ReactDOM.render(<MainContainer/>, document.getElementById('main-wrapper'));
