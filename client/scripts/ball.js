import React from 'react'
import randomColor from 'randomcolor'
require('../styles/ball.less')

function Ball (props) {
  this.active = true
  this.mass = 30
  this.friction = 0.96
  this.padding = 12
  this.v = { x: 0, y: 0 }
  this.pos = {
    x: Math.floor(Math.random()*((window.innerWidth-this.mass)+1)),
    y: Math.floor(Math.random()*((window.innerHeight-this.mass)+1)),
  }
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
    if (new Date() - this.lastUpdate > 2500) deactive();
  }, 500)
  this.conn.on('close', () => { deactive() })
  this.conn.on('error', () => { deactive() })

  // methods
  this.updatePosition = () => {
    this.v.x = this.v.x * this.friction
    this.v.y = this.v.y * this.friction

    let newpos = {
      y: parseInt(this.pos.y + this.v.y / this.mass),
      x: parseInt(this.pos.x + this.v.x / this.mass)
    }

    if (newpos.x<0) { newpos.x = 0; this.v.x = -this.v.x }
    if (newpos.y<0) { newpos.y = 0; this.v.y = -this.v.y }
    if (newpos.x>document.documentElement.clientWidth-this.mass-this.padding) {
      newpos.x = document.documentElement.clientWidth-this.mass-this.padding
      this.v.x = -this.v.x
    }
    if (newpos.y>document.documentElement.clientHeight-this.mass-this.padding) {
      newpos.y = document.documentElement.clientHeight-this.mass-this.padding
      this.v.y = -this.v.y
    }

    this.pos = newpos
  }

  this.invertDirection = () => {
    this.v.x = - this.v.x
    this.v.y = - this.v.y
  }

  this.getRadius = () => { return (this.mass + this.padding)/2 } // TODO: 12 is padding + border, find a way to remove that
  this.getCenter = () => {
    return {
      x: this.pos.x + (this.mass+this.padding)/2,
      y: this.pos.y + (this.mass+this.padding)/2
    }
  }
}

function BallComponent (props) {
  return (<div style={{
    background: props.ball.color,
    height: props.ball.mass,
    width: props.ball.mass,
    left: props.ball.pos.x + 'px',
    top: props.ball.pos.y + 'px',
    zIndex: props.ball.mass
  }}
  className="ball"></div>)
}

module.exports = {
  Ball: Ball,
  BallComponent: BallComponent
}
