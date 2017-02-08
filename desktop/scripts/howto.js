import React from 'react'
import QRCode from 'qrcode.react'

require('../styles/howto.less')

function HowTo (props) {
  return (
    <div className="howtoWrapper">
      <div className="content">
        <button onClick={props.clickHandler}>&times;</button>
        <h3>How to play</h3>
        <ul>
          <li>Open the QR Code in your phone.</li>
          <QRCode value={props.url} bgColor="transparent" /><br />
          <li>Anytime, you can move the mouse in the top right corner to see the code.</li>
          <li>You can use the old fashioned way to open links too:</li> <br />
          <span>{props.url}</span>
        </ul>
      </div>
    </div>
  )
}

export default HowTo
