import axios from 'axios'

// util function to include token on every request if token is available
import setAuthToken from '../utils/setAuthToken'

// types
import {
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  USER_LOADED
} from './types'

// alert action
import { setAlert } from './alert'

// load user
/**
 * we need to check if there is a user and if so, we need to assign
 * them to a global header; if we have a token in localStorage,
 * we *always* wanna send that
 */
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token)
  }

  try {
    const res = await axios.get('/api/auth')

    // payload we pass in is the user
    dispatch({
      type: USER_LOADED,
      payload: res.data
    })
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    })
  }
}

// log in a user
export const login = (email, password) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const body = JSON.stringify({ email, password })

  try {
    const res = await axios.post('./api/auth', body, config)

    // we get a token back on a successful response, so we need
    // to call `dispatch` with it as the payload:
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    })

    // we also need to dispatch the `loadUser` action...
    dispatch(loadUser())
  } catch (err) {
    // when our server returns an error, it gets added to the
    // `errors` array
    const errors = err.response.data.errors

    // if we receive erroneous response, we need to loop through
    // the errors and set the appropriate alert.
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
    }
    dispatch({
      type: LOGIN_FAIL
    })
  }
}

// register a user
export const register = ({ name, email, password}) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const body = JSON.stringify({ name, email, password })

  try {
    const res = await axios.post('./api/users', body, config)

    // we get a token back on a successful response, so we need
    // to call `dispatch` with it as the payload:
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    })

    dispatch(loadUser())
  } catch (err) {
    // when our server returns an error, it gets added to the
    // `errors` array
    const errors = err.response.data.errors

    // if we receive erroneous response, we need to loop through
    // the errors and set the appropriate alert.
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
    }
    dispatch({
      type: REGISTER_FAIL
    })
  }
}