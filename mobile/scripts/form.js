import React from 'react'
import getRandomColor from 'randomcolor'

require('../styles/form.less')

function Instructions (props) {
  return (
    <div className="instructionsWrapper">
      <h3>How to play</h3>
      <ul>
        <li>{'Choose a nickname'}</li>
        <li>{'Tap on Ready'}</li>
        <li>{'Tilt your phone!'}</li>
        <li>{'Eat and don\'t get eaten'}</li>
      </ul>
    </div>
  )
}

class MainForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {value: localStorage.getItem('nickname') || ''}

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    let n = event.target.value
    this.setState({value: n.substr(0, 10)})
  }

  handleSubmit(event) {
    localStorage.setItem('nickname', this.state.value)
    this.props.handleSubmit(this.state.value)
    event.preventDefault()
  }

  render() {
    let text = this.state.value ? `Hello ${this.state.value}!` : "Welcome!"

    return (
      <form className='mainForm' onSubmit={this.handleSubmit}
            style={{background: getRandomColor({luminosity: 'dark'})}}>
        <p>{text}</p>
        <input type="text" maxLength="10" placeholder="Pick a nickname" value={this.state.value} onChange={this.handleChange} /><br />
        <input type="submit" value="Ready" />
        <Instructions />
      </form>
    )
  }
}

export default MainForm
