import {
  REGISTER_FAIL,
  REGISTER_SUCCESS
} from '../actions/types'

const initialState = {
  isAuthenticated: null,
  loading: true,
  token: localStorage.getItem('token'),
  user: null
}

export default function (state = initialState, action) {
  const { type, payload } = action
  switch (type) {
    // if reg'd ok, we get the token back and user should be
    // logged in immediately
    case REGISTER_SUCCESS:
      localStorage.setItem('token', payload.token)
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false
      }
    // if reg fails, assure token is removed from localStorage
    case REGISTER_FAIL:
      localStorage.removeItem('token')
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        token: null
      }
    default: return state
  }
}