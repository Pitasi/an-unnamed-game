import React from 'react'

require('../styles/gameover.less')

function GameOver (props) {
  let clickHandler = () => {location.reload(true)}
  let getTime = () => { return parseInt((new Date() - props.date)/1000) }
  let highscore = () => { return localStorage.getItem('highscore') || 0 }
  let isHighscore = () => {
    let hs = highscore()
    localStorage.setItem('highscore', Math.max(hs, props.level))
    return (props.level > hs)
  }

  let scoreEntry = isHighscore() ?
                    <li>
                      <strong>NEW HIGHSCORE!</strong><br />
                      {`Level: ${props.level}`}
                    </li> :
                    [
                      <li key='1'>{`Highest level: ${props.level}`}</li>,
                      <li key='2'>{`You highscore is ${highscore()}`}</li>
                    ]

  return (
    <div style={{background: props.background}} className="gameoverWrapper">
      <h1>Game over :(</h1>
      <button onClick={clickHandler}>Try again</button>

      <div className="statisticsWrapper">
        <h3>Statistics</h3>
        <ul>
          <li>{`Played for ${getTime()} seconds.`}</li>
          {scoreEntry}
        </ul>
      </div>
    </div>
  )
}

export default GameOver
