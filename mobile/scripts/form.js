import React from 'react'

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
    this.setState({value: event.target.value})
  }

  handleSubmit(event) {
    localStorage.setItem('nickname', this.state.value)
    this.props.handleSubmit(this.state.value)
    event.preventDefault()
  }

  render() {
    let text = this.state.value ? `Hello ${this.state.value}!` : "Welcome!"

    return (
      <form className='mainForm' onSubmit={this.handleSubmit}>
        <p>{text}</p>
        <input type="text" placeholder="Pick a nickname" value={this.state.value} onChange={this.handleChange} /><br />
        <input type="submit" value="Ready" />
        <Instructions />
      </form>
    )
  }
}

export default MainForm
