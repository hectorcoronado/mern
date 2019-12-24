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