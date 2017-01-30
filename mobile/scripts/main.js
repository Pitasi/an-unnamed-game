import React from 'react';
import ReactDOM from 'react-dom';
import WakeLock from 'react-wakelock';
import Peer from 'peerjs'

require('../styles/main.less');

class Square extends React.Component {
  constructor(props) {
    super(props)
    this.conn = props.conn
    this.state = {active: false}
  }

  changeState(arg) {
    let newstate = arg.type === 'touchstart'
    navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
    if (navigator.vibrate && newstate) {
      navigator.vibrate(50);
    }
    this.conn.send({type: 'btn', val: newstate})
    this.setState({active: newstate})


  }

  render() {
    let classes = `button ${this.state.active?'on':'off'}`
    return (
      <div className={classes}
        onTouchStart={this.changeState.bind(this)}
        onTouchEnd={this.changeState.bind(this)}>
      </div>
    );
  }
}

class MainContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {color: 'white'}

    this.peer = new Peer({host: 'game.zaph.pw', port: 9000, path: '/peerjs'})
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
