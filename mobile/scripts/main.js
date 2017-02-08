/* Modules */
import React from 'react'
import ReactDOM from 'react-dom'
import ReactFitText from 'react-fittext'
import Peer from 'peerjs'
import MainForm from './form.js'

/* Assets */
require('../styles/main.less')
var audio = {
  levelup: new Audio(require('../sound/levelup.mp3'))
}

/* React components */

class MainContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      color: false,
      mass: 30,
      on: false
    }

    this.code = location.hash ?
                location.hash.slice(1).toLowerCase():
                window.prompt('Enter the lobby code:').toLowerCase()
    window.location.hash = '#'+this.code;
  }

  formHandler(name) {
    this.name = name
    this.setState({on: false})

    this.peer = new Peer(this.name, {host: location.hostname, port: 3000, secure: true, path: '/peerjs'})
    this.peer.on('error', (err) => { alert(err) })
    this.conn = this.peer.connect(this.code)
    this.conn.on('open', () => {
      this.conn.on('data', (o) => {
        if (o.color) this.setState({color: o.color})
        else if (o.mass) {
          audio.levelup.pause()
          audio.levelup.play()
          this.setState({mass: o.mass})
        }
      })
    })

    this.gyro = {x: 0, y: 0}
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', (e) => {
        this.gyro = e.accelerationIncludingGravity
      }, true)
    }

    setInterval(() => {
      if (this.state.on)
        this.conn.send({
          type: 'gyro',
          x: this.gyro.x || 0,
          y: this.gyro.y || 0
        })
    }, 30)
  }

  touchEventHandler(e) {
    // fix for mobile audio
    if (!this.firstTime) {
      audio.levelup.play()
      audio.levelup.pause()
      this.firstTime = true
    }
    this.setState({on: e.type === 'touchstart'})
  }

  render() {
    let main = this.state.color ?
                <div>
                  <ReactFitText compressor={1}>
                    <h1>Tap here to rush!</h1>
                  </ReactFitText>
                  <ReactFitText compressor={1}>
                    <h1>Level: {this.state.mass}</h1>
                  </ReactFitText>
                </div>:
                <ReactFitText>
                  <span>Connecting to server...</span>
                </ReactFitText>

    if (!this.code || !this.name)
      return (<MainForm handleSubmit={this.formHandler.bind(this)} />)

    return (
      <div className="container"
           style={{background: this.state.color,}}>
           <div style={{
                  width: '100%',
                  height: '100%',
                  background: this.state.on?'rgba(255,255,255,0)':'rgba(255,255,255,0.5)'
                }}
                onTouchStart={this.touchEventHandler.bind(this)}
                onTouchEnd={this.touchEventHandler.bind(this)}>
                <div className="info">
                  {main}
                </div>
           </div>
      </div>
    )
  }
}

ReactDOM.render(<MainContainer/>, document.getElementById('main-wrapper'));
