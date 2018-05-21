import 'intl'
import { addLocaleData } from 'react-intl'
import en from 'react-intl/locale-data/en'
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import styled from 'styled-components'
import Units from './Units'
import sections from './Config'
import Dummy from './Dummy'
import Timer from './Timer'
addLocaleData([...en])


const Wrap = styled.div`
`
const AppComponent = styled.div`
  display: flex;
  margin-bottom: 20px;
`
const Section = styled.div`
  margin: 10px;
  border: 1px solid dotted;
  height: 250px;
  overflow: auto;
  margin-bottom: 10px;
  cursor: pointer;
`
const Header = styled.div`
  padding: 5px;
  font-weight: bold;
  color: red;
  cursor: pointer;
  border: 1px dotted;
  background-color: ${props => props.selected? 'lightblue': 'lightyellow'};
`
const SubHeader = styled(Header)`
  padding: 5px 10px;
  color: blue;
`
const AppArea = styled.div`
  text-align: center;
  margin: 20px 0px 0 0px;
  font-size: 20px;
  font-weight: bold;
  flex: 2;
`
const Control = styled.button`
  display: block;
  cursor: pointer;
  margin: 5px 0;
  color: brown;
`
const Span = styled.span`
  color: orange;
  font-weight: bold;
  font-size: 12px;
`
class App extends React.Component {
  constructor () {
    super()
    this.state = {
      speed: 1500,
      paused: false,
      component: Dummy,
      section: {},
      expanded: false
    }
    this._element = {}
  }

  componentDidMount () {
    this.increase()
    let { onClear, onReset } = this.props;

    document.addEventListener('keydown', (event) => {
      let { keyCode } = event;
      if (keyCode === 32) {
        this.pause()
      }
      if (keyCode === 40) {
        this.increase()
      }
      if (keyCode === 38) {
        this.decrease()
      }
    })
    const {component: components} = sections[0]
    const { name, component, ...props } = components[0]
    this.props.onClick(name.replace(/ /g, ''))
    // this.onSectionClick(sections[0])
    this.setState({
      section: name,
      component,
      ...props
    })
  }

  increase = () => {
    const { speed } = this.state
    this.setState({
      speed: speed + 500
    })
  }

  decrease = () => {
    this.setState({
      speed: this.state.speed > 0 ? this.state.speed - 500 : 1000
    })
  }

  pause = () => {
      this.setState({
          paused: !this.state.paused
      })
  }

  shuffle = () => {
    this.setState({
      shuffled: !this.state.shuffled
    })
  }

  onSectionClick = ({name, component, skipSplit, ...props}) => {
    const { section } = this.state
    if (component instanceof Array) {
      this._subSubSections = component.map((sec, index) => 
        <SubHeader
          innerRef={element => {this._element[sec.name] = element}}
          onClick={() => this.onSectionClick(sec)}>{sec.name}
        </SubHeader>
      )
      this.setState({
        expanded: name === this.state.expandedSection ? !this.state.expanded: true,
        expandedSection: name
      })
    } else {
      Object.values(this._element).filter(element => element).forEach(element => element.classList.remove('active'))
      this._element[name].classList.add("active")
      this.props.onClick(name.replace(/ /g, ''))
      this.setState({
        section: name,
        component,
        shuffled: false,
        skipSplit,
        ...props
      })
    }
  }

  getSections = () => {
    const { section, expanded, expandedSection } = this.state
    return sections.map((sec, index) => (
      <div>
        <Header key={index} innerRef={element => {this._element[sec.name] = element}} onClick={() => this.onSectionClick(sec)}>{sec.name}</Header>
        {sec.name === expandedSection && expanded && this._subSubSections}
      </div>
    ))
  }

  render () {
    const { speed, paused, shuffled, section, expanded, component, skipSplit, ...restState } = this.state
    const { onClick } = this.props
    return <Wrap>
      <Timer />
      <Span>Excerpts from Prof. Kev Nair's Fluentzy: Fluency Development  (<a href='http://fluentzy.com/' target='_blank'>fluentzy.com</a>)</Span>
      <AppComponent>
        <Section>
          <div>Click a topic to begin!</div>
          {this.getSections()}
        </Section>
        <AppArea>
            <div className='plus' onClick={this.shuffle}>&#128256;</div>
            <span className='speed'>Speed: {this.state.speed/1000}s </span>
            <Control className='plus' onClick={this.decrease}>fast</Control>
            <Control className='minus' onClick={this.increase}>slow</Control>
            <Control className='pause' onClick={this.pause}>{paused ? "play" : "pause"} </Control>
        </AppArea>
      </AppComponent>
      {React.createElement(component, {
        value: this.props.value || {},
        section,
        speed: speed || 200,
        paused,
        shuffled,
        skipSplit,
        ...restState,
        pause: this.pause
      })}
      </Wrap>
  }
}

App.propTypes = {
}
const s = state => ({
  value: state.data
})
const d = dispatch => ({
  onClick: (payload) => dispatch({type: 'HANDLE_REQUEST', payload})
})
export default injectIntl(connect(s, d)(App))