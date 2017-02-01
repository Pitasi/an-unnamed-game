import React from 'react'
import randomColor from 'randomcolor'

function Ball (props) {
  this.active = true
  this.size = 50
  this.bounceSpeed = 0.96
  this.v = { x: 0, y: 0 }
  this.pos = { x: 0, y: 0 }
  this.conn = props.conn
  this.color = randomColor()
  this.conn.send({color: this.color})

  // executed when created
  this.conn.on('data', (o) => {
    if (o.type !== 'gyro') return
    let ax = - o.x * 5,
        ay = - o.y * 5;
    this.v.x = this.v.x + ax
    this.v.y = this.v.y + ay
    this.lastUpdate = + new Date()
  })
  var deactive = () => {
    this.active = false
  }
  setInterval(() => {
    if (new Date() - this.lastUpdate > 1000) deactive();
  }, 500)
  this.conn.on('close', () => { deactive() })
  this.conn.on('error', () => { deactive() })

  // methods
  this.updatePosition = () => {
    this.v.x = this.v.x * this.bounceSpeed
    this.v.y = this.v.y * this.bounceSpeed

    let newpos = {
      y: parseInt(this.pos.y + this.v.y / 50),
      x: parseInt(this.pos.x + this.v.x / 50)
    }

    if (newpos.x<0) { newpos.x = 0; this.v.x = -this.v.x; }
    if (newpos.y<0) { newpos.y = 0; this.v.y = -this.v.y; }
    if (newpos.x>document.documentElement.clientWidth-this.size) { newpos.x = document.documentElement.clientWidth-this.size; this.v.x = -this.v.x; }
    if (newpos.y>document.documentElement.clientHeight-this.size) { newpos.y = document.documentElement.clientHeight-this.size; this.v.y = -this.v.y; }

    this.pos = newpos
  }
}

function BallComponent (props) {
  return (<div style={{
    background: props.ball.color,
    height: props.ball.size,
    width: props.ball.size,
    left: props.ball.pos.x + 'px',
    top: props.ball.pos.y + 'px'
  }}
  className="ball"></div>)
}

module.exports = {
  Ball: Ball,
  BallComponent: BallComponent
}
