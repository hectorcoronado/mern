import {
  AUTH_ERROR,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  USER_LOADED
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
    // if reg or auth fails, assure token is removed from localStorage
    case REGISTER_FAIL:
    case AUTH_ERROR:
      localStorage.removeItem('token')
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        token: null
      }
    /**
     * if `loadUser`'s `try` runs, then this gets called, 
     * setting `isAuthenticated` to true (the token worked);
     * also sets `user` to payload, which includes name, email, avatar...,
     * but *NOT* password, because in the backend, we wrote:
     * const user = await User.findById(req.user.id).select('-password')
     */
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload
      }
    default: return state
  }
}