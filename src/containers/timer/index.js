import React from 'react';

class Timer extends React.Component {
  constructor(props) {
    super(props)
    console.log('props.initTime::', props.initTime)
    
    this.state ={
      initTime: props.initTime,
      elapsed: 0
    }    
  }

  componentDidMount = () => {
    this.timer = setInterval(this.tick, 1000)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({initTime: nextProps.initTime})
  }

  tick = () => {    
    this.setState({elapsed: Date.now() - this.state.initTime})
  }

  render () {
    const timerInSecs = parseInt(this.state.elapsed / 1000)
    
    const hours = parseInt((timerInSecs / 3600) % 24).toString().padStart(2, "0")
    const minutes = parseInt((timerInSecs / 60) % 60).toString().padStart(2, "0")
    const seconds = parseInt(timerInSecs % 60).toString().padStart(2, "0")
    
    return (
      <h1>{`${hours}:${minutes}:${seconds}`}</h1>
    );
  }
}

export default Timer