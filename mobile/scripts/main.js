/* Modules */
import React from 'react'
import ReactDOM from 'react-dom'
import ReactFitText from 'react-fittext'
import Peer from 'peerjs'

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

    this.peer = new Peer({host: location.hostname, port: 3000, secure: true, path: '/peerjs'})
    this.peer.on('error', (err) => { alert(err) })

    this.code = location.hash?location.hash.slice(1):window.prompt('Enter the code')
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
    let textComp = this.state.color ?
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
                    {textComp}
                </div>
           </div>
      </div>
    )
  }
}

ReactDOM.render(<MainContainer/>, document.getElementById('main-wrapper'));
