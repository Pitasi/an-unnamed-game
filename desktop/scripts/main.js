import React from 'react'
import ReactDOM from 'react-dom'
import QRCode from 'qrcode.react'
import HowTo from './howto.js'

import Peer from 'peerjs'
import randomID from 'random-id'

import {Ball, BallComponent} from './ball.js'

require('../styles/main.less')
var audio = {
  welcome: new Audio(require('../sound/welcome.mp3')),
  pop:     require('../sound/pop.mp3')
}

class MainContainer extends React.Component {
  constructor(props) {
    super(props);

    audio.welcome.play()

    this.balls = []
    this.food = []
    this.state = {
      ballComponents: [],
      firstTime: localStorage.getItem('firstTime')
    }

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

    this.spawnFoods()
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

    let missing = maxFood - this.food.length
    for (var i = 0; i < missing; i++) {
      this.food.push(new Ball({player: false}))
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
      (new Audio(audio.pop)).play()
      b1.setMass(b2.mass/2)
      if (b2.player) b2.conn.send({dead: true})
      b2.active = false
    }
  }

  gameLoop() {
    this.deleteInactiveBalls()

    this.balls.forEach((b) => {b.updatePosition()})

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

  closeHowTo() {
    localStorage.setItem('firstTime', true)
    this.setState({firstTime: true})
  }

  render() {
    let playerList = this.state.ballComponents.map((p) => {
      return <li key={p.key}>{p.key}</li>
    })
    let howto = (!this.state.firstTime) ?
                <HowTo clickHandler={this.closeHowTo.bind(this)} url={`https://${location.host}/#${this.code}`} /> :
                <span></span>

    return (
      <div className="container">
        {howto}
        <div className="infobox">
          <h1>Players: {this.state.ballComponents.length}</h1>
          <ul> {playerList} </ul>

          <QRCode value={`https://${location.host}/#${this.code}`} /> <br />
          <p>Lobby code: <b>{`${this.code.toUpperCase()}`}</b></p>
        </div>
        {this.state.ballComponents}
        {this.state.foodComponents}
      </div>
    )
  }
}
ReactDOM.render(<MainContainer/>, document.getElementById('main-wrapper'));
