import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

require('../styles/main.less');

class Square extends React.Component {
  constructor(props) {
    super(props)
    this.socket = io()
    this.socket.on('update', this.changeState.bind(this))
    this.state = {active: false}
  }

  changeState(val) {
    this.setState({active: val})
  }

  render() {
    return (
      <div className={this.state.active?'on':'off'}>
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