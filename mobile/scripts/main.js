import React from 'react';
import ReactDOM from 'react-dom';
import WakeLock from 'react-wakelock';
import Peer from 'peerjs'

require('../styles/main.less');

class MainContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {color: 'white'}

    this.peer = new Peer({host: location.hostname, port: 3000, secure: true, path: '/peerjs'})
    this.peer.on('error', (err) => { alert(err) })

    this.code = location.hash?location.hash.slice(1):window.prompt('Enter the code')
    this.conn = this.peer.connect(this.code)
    this.conn.on('open', () => {
      this.conn.on('data', (o) => {
        if (o.color) this.setState({color: o.color})
      })
    })

    if (window.DeviceMotionEvent) {
    	window.addEventListener('devicemotion', (e) => {
        this.conn.send({
          type: 'gyro',
          x: event.accelerationIncludingGravity.x,
          y: event.accelerationIncludingGravity.y
        })
    	}, true)
    }
  }

  render() {
    return (
      <div className="container" style={{background: this.state.color}}>
        <WakeLock />
      </div>
    )
  }
}

ReactDOM.render(<MainContainer/>, document.getElementById('main-wrapper'));
