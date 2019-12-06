import { REMOVE_ALERT, SET_ALERT } from '../actions/types'

const initialState = []

export default function (state = initialState, action) {
  const { payload, type } = action

  switch (type) {
    case REMOVE_ALERT:
      // remove a specific alert by its id
      return state.filter(alert => alert.id !== payload)
    case SET_ALERT:
      return [...state, payload]
    default:
      return state
  }
}