import React from 'react';
import ReactDOM from 'react-dom';

function UserList(props) {
  var list = props.users.map( user => { return (<li className="user" key={user}>{user}</li>) });
  return (
    <ol>{list}</ol>
  );
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {list: [],
                  nickname: this.props.nickname}
    this.socket = props.socket;
    this.handleSocket();
    this.socket.emit('list request');
  }

  handleSocket() {
    this.socket.on('list update', (function(userList) {
      this.setState({list: userList});
    }).bind(this));
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <UserList users={this.state.list} />
        </div>
      </div>
    );
  }
}


module.exports = Game
