import React from 'react'
import styled from 'styled-components'
import { ConnectedRouter as Router } from 'react-router-redux'
import { Route } from 'react-router-dom'
import App from './App'
import { history } from './store'
const Wrap = styled.div`
  display: flex;
  width: 100%;
`
export default () => {
  return (
    <Router history={history}>
      <Wrap>
        <Route path='/' component={App} />
      </Wrap>
    </Router>
  )
}
