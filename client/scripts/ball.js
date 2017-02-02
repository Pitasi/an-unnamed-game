import React from 'react'
import randomColor from 'randomcolor'
require('../styles/ball.less')

function Ball (props) {
  this.active = true
  this.mass = 30
  this.newMass = this.mass
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
  })
  var deactive = () => {
    this.active = false
  }
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

    if (newpos.x - this.getRadius() < 0) { newpos.x = this.getRadius(); this.v.x = -this.v.x }
    if (newpos.y - this.getRadius() < 0) { newpos.y = this.getRadius(); this.v.y = -this.v.y }
    if (newpos.x + this.getRadius() > document.documentElement.clientWidth) {
      newpos.x = document.documentElement.clientWidth-this.getRadius()
      this.v.x = -this.v.x
    }
    if (newpos.y + this.getRadius() > document.documentElement.clientHeight) {
      newpos.y = document.documentElement.clientHeight-this.getRadius()
      this.v.y = -this.v.y
    }

    this.pos = newpos
  }

  this.invertDirection = () => {
    this.v.x = - this.v.x
    this.v.y = - this.v.y
  }

  this.getSize = () => { return this.mass + this.padding }
  this.getRadius = () => { return this.getSize()/2 }
  this.getCenter = () => { return this.pos }

  this.setMass = (deltaMass) => {
    this.newMass += deltaMass

    var step = () => {
      if (this.mass < this.newMass) {
        this.mass++
        console.log(this.mass)
        window.requestAnimationFrame(step)
      }
    }
    window.requestAnimationFrame(step)
  }
}

function BallComponent (props) {
  return (<div style={{
    background: props.ball.color,
    height: props.ball.mass,
    width: props.ball.mass,
    left: props.ball.pos.x + 'px',
    top: props.ball.pos.y + 'px',
    marginLeft: -props.ball.getSize()/2,
    marginTop: -props.ball.getSize()/2,
    zIndex: props.ball.mass
  }}
  className="ball"></div>)
}

module.exports = {
  Ball: Ball,
  BallComponent: BallComponent
}
