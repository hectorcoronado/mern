import axios from 'axios'

// types
import {
  REGISTER_FAIL,
  REGISTER_SUCCESS
} from './types'

// alert action
import { setAlert } from './alert'

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