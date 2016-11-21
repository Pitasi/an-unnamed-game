import React from 'react';
import ReactDOM from 'react-dom';

require('../styles/game.less');

function UserList(props) {
  var list = props.users.map( user => {
    return (<li className={props.nickname===user?'active':''} key={user}>{user}</li>)
  });

  return (
    <div className="userlist">
      <h1>Connected users:</h1>
      <ol>{list}</ol>
    </div>
  );
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {list: []}
    this.handleSocket();
    this.props.socket.emit('list request');
  }

  handleSocket() {
    this.props.socket.on('list update', (function(userList) {
      this.setState({list: userList});
    }).bind(this));
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <UserList users={this.state.list} nickname={this.props.nickname} />
        </div>
      </div>
    );
  }
}


module.exports = Game
