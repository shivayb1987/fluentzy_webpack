export default function counter (state = {key: []}, action) {
  switch (action.type) {
    case 'RESPONSE':
      return {
        ...state,
        data: action.response
      }
    default:
      return state
  }
}
