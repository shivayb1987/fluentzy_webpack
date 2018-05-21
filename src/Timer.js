import React from 'react'

export default class Timer extends React.Component {
  constructor () {
    super()
    this.state = {
      elapsed: 0
    }
  }

  componentDidMount () {
    setInterval(() => {
      this.setState({
        elapsed: this.state.elapsed + 1
      })
    }, 1000)
  }

  render () {
    return <div>{`Duration: ${Math.floor(this.state.elapsed / 60)} minutes`}</div>
  }
}
