import React from 'react'
import ReactDOM from 'react-dom'
import QRCode from 'qrcode.react'

import Peer from 'peerjs'

import randomColor from 'randomcolor'
import randomID from 'random-id'

require('../styles/main.less')

class Ball extends React.Component {
  constructor(props) {
    super(props)
    /* constants */
    this.size = 50
    this.bounceSpeed = 0.96
    this.v = {x: 0, y: 0}
    this.state = {pos: {x: 0, y: 0}, active: true}

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

    var deactive = () => {
      this.setState({active: false})
      this.props.statehandler()
    }
    this.conn.on('close', () => { deactive() })
    this.conn.on('error', () => { deactive() })
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

  isActive() { return this.state.active }

  render() {
    let el = this.state.active ?
             <div style={{
               background: this.color,
               height: this.size,
               width: this.size,
               left: this.state.pos.x + 'px',
               top: this.state.pos.y + 'px'
             }}
             className="ball"></div> :
             null

    return el
  }
}

class MainContainer extends React.Component {
  constructor(props) {
    super(props);
    this.code = randomID(3, 'a')
    this.peer = new Peer(this.code, {host: location.hostname, secure: true, port: 3000, path: '/peerjs'})
    this.state = {mobiles: [], count: 0}
    this.peer.on('connection', (conn) => {
      conn.on('open', () => {
        conn.on('close', () => {
          var newMobiles = this.state.mobiles.filter((o) => {return o.peerId !== conn.peer})
        })

        let newMobiles = this.state.mobiles.slice(0)
        newMobiles.push({
          peerId: conn.peer,
          ball: <Ball key={conn.peer} statehandler={this.ballRemoved.bind(this)} conn={conn} />
        })
        this.setState({ mobiles: newMobiles, count: this.state.count+1 })
      })
    })
    this.peer.on('error', (err) => { alert(err) })
  }

  ballRemoved(b) {
    let newCount = this.state.count -1
    this.setState({count: newCount})
  }

  render() {
    let balls = this.state.mobiles.map((o) => {return o.ball})
    return (
      <div className="container">
        <div className="infobox">
          <h1>Players: {this.state.count}</h1>
          <a href={`https://${location.host}/mobile/#${this.code}`} target="_blank">
            <QRCode value={`https://${location.host}/mobile/#${this.code}`} /> <br />
            {`https://${location.host}/mobile/#${this.code}`}
          </a>
        </div>
        {balls}
      </div>
    )
  }
}
ReactDOM.render(<MainContainer/>, document.getElementById('main-wrapper'));
