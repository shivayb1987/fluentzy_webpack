import { put, call, takeEvery, all } from 'redux-saga/effects'
import invokeService from './service'
export function * handleRequest (action) {
  const response = yield call(invokeService, action.payload)
  yield put({type: 'RESPONSE', response: response.data})
}

export default function * watchRequest () {
  yield takeEvery('HANDLE_REQUEST', handleRequest)
}
