import React from 'react';
import ReactDOM from 'react-dom';
import NicknameSelector from './nickname_selector.jsx';
import Game from './game.jsx';
import io from 'socket.io-client';

class MainContainer extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io();
    this.state = {
      nickname: null,
      element: <NicknameSelector socket={this.socket} />
    }
    this.handleSocket();
  }

  handleSocket() {
    this.socket.on('username already taken', function(){
      alert('Username already taken!\nPlease pick another one.');
    });

    this.socket.on('username invalid', function(){
      alert('Invalid username\nPlease pick another one!');
    });

    var updateNickname = (function(msg){
                            this.changeOpacity(null, 0, 250, (function() {
                              this.changeOpacity(0, 1, 350);
                              this.setState({nickname: msg, element: <Game />});
                            }).bind(this))
                          }).bind(this);

    this.socket.on('username valid', updateNickname);
  }

  changeOpacity(startOpacity, endOpacity, timeout, callback) {
    var nodes = document.getElementsByClassName('container');
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (startOpacity !== null) node.style.opacity = startOpacity;
      window.requestAnimationFrame(function() {
        node.style.transition = `opacity ${timeout}ms`;
        node.style.opacity = endOpacity;
        if (callback) setTimeout(callback, timeout);
      });
    }
  }

  componentDidMount() {
    this.changeOpacity(0, 1, 500);
	}

  render() {
    return (
      <div className="container">{this.state.element}</div>
    )
  }
}
ReactDOM.render(<MainContainer/>, document.getElementById('main-wrapper'));
