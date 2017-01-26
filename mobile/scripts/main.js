import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

require('../styles/main.less');

class Square extends React.Component {
  constructor(props) {
    super(props)
    this.socket = io()
    this.state = {active: false}
  }

  changeState() {
    let newstate = !this.state.active
    this.socket.emit('update', newstate)
    this.setState({active: newstate})
  }

  render() {
    return (
      <div className={this.state.active?'on':'off'}
        onTouchStart={this.changeState.bind(this)}
        onTouchEnd={this.changeState.bind(this)}>
      </div>
    );
  }
}

class MainContainer extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io();
    this.socket.on('mypong', () => {alert(new Date() - this.state.pingdate)})
  }

  render() {
    return (
      <div className="container">
        <Square
          value="mobile button"
          onClick={() => {
              console.log('ping')
              this.socket.emit('myping')
              this.setState({pingdate: new Date()})
            }
          }
        />
      </div>
    )
  }
}
ReactDOM.render(<MainContainer/>, document.getElementById('main-wrapper'));
