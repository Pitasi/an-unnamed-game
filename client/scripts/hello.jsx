import React from 'react';
import ReactDOM from 'react-dom';

class MessageList extends React.Component {
  render() {
    return <ul id="messages"></ul>
  }
}

ReactDOM.render(<MessageList/>, document.getElementById('messages-container'));
