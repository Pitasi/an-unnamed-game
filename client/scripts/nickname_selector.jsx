import React from 'react';
import ReactDOM from 'react-dom';

class NicknameSelector extends React.Component {
  constructor(props) {
    super(props);
    this.socket = props.socket;
    this.state = {value: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value.replace(' ', '')})
  }

  handleSubmit(event) {
    this.socket.emit('set nickname', this.state.value);
    event.preventDefault();
  }

  render() {
    var main_msg = this.state.value ?
              `Welcome ${this.state.value}!` :
              `Welcome!`

    var sub_msg = this.state.value ?
                  'Press [enter] when you\'re ready.' :
                  'Start writing your nickname below.';

    return (
      <div className="nickname-form-container">
        <div className="greetings">
          <h1>{main_msg}</h1>
          <h2>{sub_msg}</h2>
        </div>

        <form onSubmit={this.handleSubmit}>
          <input type="text" maxLength="20" value={this.state.value} onChange={this.handleChange} placeholder="Pick a nickname" />
          <button type="submit" disabled={!this.state.value}>
            <i className="fa fa-paper-plane" aria-hidden="true"></i>
          </button>
        </form>
      </div>
    )
  }
}

module.exports = NicknameSelector
