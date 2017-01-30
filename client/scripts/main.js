import React from 'react'
import ReactDOM from 'react-dom'
import Peer from 'peerjs'
import randomColor from 'randomcolor'
import randomID from 'random-id'

require('../styles/main.less')

class Square extends React.Component {
  constructor(props) {
    super(props)
    this.state = {active: false}
    this.mobiles = props.mobiles

    for (var i in this.mobiles)
      this.mobiles[i].on('data', (o) => {
        if (o.type !== 'btn') return
        this.setState({active: o.val})
      })
  }

  render() {
    return (
      <div className={this.state.active?'on':'off'}></div>
    );
  }
}

class Pointer extends React.Component {
  constructor(props) {
    super(props)
    /* constants */
    this.active = true
    this.size = 50
    this.bounceSpeed = 0.96
    this.v = {x: 0, y: 0}
    this.state = {pos: {x: 0, y: 0}}

    this.conn = props.conn
    this.color = randomColor()
    this.conn.send({color: this.color})

    this.conn.on('data', (o) => {
      if (o.type !== 'gyro') return
      let ax = - o.x * 5,
          ay = - o.y * 5;
      this.v.x = this.v.x + ax
      this.v.y = this.v.y + ay
    })

    this.conn.on('close', () => { this.active = false })
    this.conn.on('error', () => { this.active = false })
  }

  componentDidMount() {
    var updateFrame = () => {
      this.v.x = this.v.x * this.bounceSpeed
      this.v.y = this.v.y * this.bounceSpeed

      let newpos = {
        y: parseInt(this.state.pos.y + this.v.y / 50),
        x: parseInt(this.state.pos.x + this.v.x / 50)
      }

      if (newpos.x<0) { newpos.x = 0; this.v.x = -this.v.x; }
      if (newpos.y<0) { newpos.y = 0; this.v.y = -this.v.y; }
      if (newpos.x>document.documentElement.clientWidth-this.size) { newpos.x = document.documentElement.clientWidth-this.size; this.v.x = -this.v.x; }
      if (newpos.y>document.documentElement.clientHeight-this.size) { newpos.y = document.documentElement.clientHeight-this.size; this.v.y = -this.v.y; }

      this.setState({
        pos: newpos
      })

      if (this.active) window.requestAnimationFrame(updateFrame.bind(this))
    }
    updateFrame()
  }

  render() {
    return (
      <div style={{
              background: this.color,
              height: this.size,
              width: this.size,
              left: this.state.pos.x + 'px',
              top: this.state.pos.y + 'px'
            }}
           className="pointer"></div>
    )
  }
}

class MainContainer extends React.Component {
  constructor(props) {
    super(props);
    this.code = randomID(3, 'a')
    this.peer = new Peer(this.code, {key: 'r1sjrgzh87rdx6r'})
    this.state = {mobiles: [], count: 0}
    this.peer.on('connection', (conn) => {
      conn.on('open', () => {
        conn.on('close', () => {
          var newMobiles = this.state.mobiles.filter((o) => {return o.peerId !== conn.peer})
          let count = this.state.count - 1
          this.setState({ mobiles: newMobiles, count: count })
        })

        let count = this.state.count + 1
        let newMobiles = this.state.mobiles.slice(0)
        newMobiles.push({
          peerId: conn.peer,
          button: <Square key={conn.peer} conn={conn} />,
          pointer: <Pointer key={conn.peer} conn={conn} />
        })
        this.setState({ mobiles: newMobiles, count: count })
      })
    })
    this.peer.on('error', (err) => { alert(err) })

  }

  render() {
    let buttons = this.state.mobiles.map((o) => {return o.button})
    let pointers = this.state.mobiles.map((o) => {return o.pointer})
    return (
      <div className="container">
        <h1>Players: {this.state.count}</h1>
        <p>Your code is: {this.code}, open http:\/\/game.zaph.pw/mobile and enter it.</p>
        {buttons}
        {pointers}
      </div>
    )
  }
}
ReactDOM.render(<MainContainer/>, document.getElementById('main-wrapper'));
