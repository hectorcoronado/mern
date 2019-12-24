import axios from 'axios'

// actions
import { setAlert } from './alert'

// types
import {
  GET_PROFILE,
  PROFILE_ERROR
} from './types'

// get current user's profile; called as soon as we reach dashboard page
export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get('/api/profile/me')

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    })
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    })
  }
}

/**
 * create or update a user profile
 * 
 * @param {formData} string data submitted by user
 * @param {history} string used to redirect user after submit
 * @param {edit} boolean default is false; if true, user is updating profile
 */
export const createProfile = (formData, history, edit = false) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const res = await axios.post('/api/profile', formData, config)

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    })
    
    // set appropriate alert based on profile creation vs updating
    dispatch(setAlert(
      edit ? 'Profile Updated' : 'Profile Created'
    ), 'success')

    // if creating a new profile, redirect to dashboard
    if (!edit) {
      history.push('/dashboard')
    }
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
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    })
  }
}