// Entry file
// locale/index.js

import get from 'lodash/get'

import enIN from './IN/en'

export default locale => get({
  'en-IN': enIN
}, locale, enIN)
