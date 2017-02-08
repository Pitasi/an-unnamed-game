import React from 'react'
import ReactFitText from 'react-fittext'
import getRandomColor from 'randomcolor'

require('../styles/ball.less')

function randInt (min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

function Ball (props) {
  this.player = props.player // difference between food and players
  this.active = true
  this.mass = this.player ? 30 : 10
  this.padding = 12
  this.newMass = this.mass
  this.friction = 0.96
  this.v = { x: 0, y: 0 }
  this.pos = {
    x: randInt(this.mass+this.padding+1, window.innerWidth-this.mass-this.padding-1),
    y: randInt(this.mass+this.padding+1, window.innerHeight-this.mass-this.padding-1)
  }
  this.color = this.player ? getRandomColor() : '#76FF03'

  if (this.player) {
    this.conn = props.conn
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
  }

  // methods
  this.updatePosition = () => {
    this.v.x = this.v.x * this.friction
    this.v.y = this.v.y * this.friction

    let newpos = {
      y: parseInt(this.pos.y + this.v.y / (5*Math.sqrt(this.mass))),
      x: parseInt(this.pos.x + this.v.x / (5*Math.sqrt(this.mass)))
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
        window.requestAnimationFrame(step)
      }
    }
    window.requestAnimationFrame(step)
    this.conn.send({mass: this.newMass})
  }
}

function BallComponent (props) {


  return (
    <div style={{
      background: props.ball.color,
      height: props.ball.mass,
      lineHeight: props.ball.mass + 'px',
      width: props.ball.mass,
      left: props.ball.pos.x + 'px',
      top: props.ball.pos.y + 'px',
      marginLeft: -props.ball.getSize()/2,
      marginTop: -props.ball.getSize()/2,
      zIndex: props.ball.mass
    }}
    className="ball">
      <h1 style={{
        fontSize: (props.ball.mass/10) + 'px'
      }}>{props.ball.player?props.ball.conn.peer:''}</h1>
    </div>
  )
}

module.exports = {
  Ball: Ball,
  BallComponent: BallComponent
}
