import React from 'react';
import ReactDOM from 'react-dom';
import Peer from 'peerjs'

require('../styles/main.less');

class MainContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {color: 'white', on: false}

    this.peer = new Peer({host: location.hostname, port: 3000, secure: true, path: '/peerjs'})
    this.peer.on('error', (err) => { alert(err) })

    this.code = location.hash?location.hash.slice(1):window.prompt('Enter the code')
    this.conn = this.peer.connect(this.code)
    this.conn.on('open', () => {
      this.conn.on('data', (o) => {
        if (o.color) this.setState({color: o.color})
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

  touchEventHandler(e) { this.setState({on: e.type === 'touchstart'}) }

  render() {
    return (
      <div className="container"
           style={{background: this.state.color,}}
           >
           <div style={{
                  width: '100%',
                  height: '100%',
                  background: this.state.on?'rgba(255,255,255,0)':'rgba(255,255,255,0.5)'
                }}
                onTouchStart={this.touchEventHandler.bind(this)}
                onTouchEnd={this.touchEventHandler.bind(this)}
             >
           </div>
      </div>
    )
  }
}

ReactDOM.render(<MainContainer/>, document.getElementById('main-wrapper'));
