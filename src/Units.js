import React, { PropTypes } from 'react'
import styled from 'styled-components'
import { Line } from 'react-progressbar'
const UnitsComponent = styled.div`
  text-align: center;
  font-size: 20px;
  /* transition-timing-function: ease;
  transition-duration: 1s;
  animation: customAnimation 1s infinite; */
  font-weight: bold;
  color: ${props => props.color}
`
const Playing = styled.div`
  font-size: 10px;
  color: gray;
  margin-top: 10px;
`
const Button = styled.button`
  margin-left: 20px;
`
export default class Units extends React.Component {
  constructor () {
    super()
    this.state = {
      sentence: '',
      index: 0,
      color: 'red',
      filter: '',
      speed: 1000,
      count: 0,
      progress: 0
    }
    this.colors = {
      0: "red",
      1: "green",
      2: "purple",
      3: "#607d8b",
      4: "orangered",
      5: "blue",
      6: "brown",
      7: "#009688"
    }
  }

  updateSentence = () => {
    const { value } = this.props
    const length = value.key.length
    if (!length) {
      return
    }
    let { index, reversed, count } = this.state
    let next = reversed ? index - 1 : index + 1
    if (next < 0) {
      next = 0
      this.setState({
        reversed: false
      })
    }
    if (this.props.shuffled) {
      next = Math.floor(Math.random() * length)
    }
    const color = next % (Object.keys(this.colors).length)
    const sentence = value["key"][index] || ''
    count = reversed ? count -1 : count + 1
    if (next >= length) {
      count = 0,
      next = 0
    }
    const progress = (count / length)
    this.setState({
      sentence,
      previous: this.state.sentence,
      index: next,
      color: this.colors[color],
      count: count,
      progress
    })
  }

  componentWillReceiveProps (nextProps) {
    this.id && clearInterval(this.id)
    if (!nextProps.paused) {
        this.id = setInterval(this.updateSentence.bind(this), nextProps.speed)
    }
    if (nextProps.section !== this.props.section) {
      this.setState({
        index: 0,
        progress: 0,
        count: 0
      })
    }
  }

  componentWillUnmount () {
    clearInterval(this.id)
  }

  onPrevious = () => {
    this.setState({
      reversed: !this.state.reversed
    })
  }

  render () {
    const { sentence, color, progress, reversed } = this.state
    const { skipSplit } = this.props
    var options = {
        strokeWidth: 1,
        trailColor: '#f4f4f4',
        trailWidth: 1,
        color: 'green',
        text: {
          style: {
            fontSize: '10px'
          }
        }
    };
    const percent = Math.floor(progress  * 101) + '%'
    return (
      <UnitsComponent color={color}>
        <Line progress={this.state.progress} options={options} text={percent} initialAnimate />
        {<Playing>(playing: {this.props.section})<Button onClick={this.onPrevious}>{reversed ? 'Next' : 'Previous'}</Button></Playing>}
        { !skipSplit ? <span>{sentence.split('+').map((question, key) => <div key={key}>{question}</div>)}</span> :
          <span>{sentence}</span>
        }
      </UnitsComponent>
    )
  }
}

Units.propTypes = {
}

Units.defaultProps = {
    speed: 1000
}
