import axios from 'axios'
const invokeService = (requestData = 'A') => {
  // return new Promise((resolve, reject) => {
  //   const res = require('http://localhost:4000/data/' + requestData + '.json')
  //   resolve(res)
  // })
  return axios.get('http://localhost:4000/data/' + requestData + '.json')
}

export default invokeService
