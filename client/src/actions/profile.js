import axios from 'axios'

// actions
import { setAlert } from './alert'

// types
import {
  CLEAR_PROFILE,
  DELETE_ACCOUNT,
  GET_PROFILE,
  GET_PROFILES,
  GET_REPOS,
  PROFILE_ERROR,
  UPDATE_PROFILE
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

// get all profiles
export const getProfiles = () => async dispatch => {
  // whenever we call this, we wanna clear any profile that's in state
  // (we need to do this b/c when we visit a single user's page, their
  // profile gets added to the state)
  dispatch({ type: CLEAR_PROFILE })

  try {
    const res = await axios.get('/api/profile/')

    dispatch({
      type: GET_PROFILES,
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
 * get profile by id
 * @param {STRING} userId
 */
export const getProfileById = userId => async dispatch => {
  try {
    const res = await axios.get(`/api/profile/user/${userId}`)

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
 * get github repos
 * @param {STRING} username
 */
export const getGithubRepos = username => async dispatch => {
  try {
    const res = await axios.get(`/api/profile/github/${username}`)

    dispatch({
      type: GET_REPOS,
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

// add experience
export const addExperience = (formData, history) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const res = await axios.put('/api/profile/experience', formData, config)

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    })
    
    dispatch(setAlert('Experience Added', 'success'))

    history.push('/dashboard')

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

// add education
export const addEducation = (formData, history) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const res = await axios.put('/api/profile/education', formData, config)

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    })
    
    dispatch(setAlert('Education Added', 'success'))

    history.push('/dashboard')

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

// delete experience
export const deleteExperience = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/experience/${id}`)

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    })

    dispatch(setAlert('Experience Removed', 'success'))
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

// delete education
export const deleteEducation = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/education/${id}`)

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    })

    dispatch(setAlert('Education Removed', 'success'))
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

// delete account and profile
export const deleteAccount = () => async dispatch => {
  if (window.confirm('Are you sure? This CANNOT be undone.')) {
    try {
      const res = await axios.delete(`/api/profile`)
  
      dispatch({
        type: CLEAR_PROFILE
      })

      dispatch({
        type: DELETE_ACCOUNT
      })
  
      dispatch(setAlert('Your account has been permanently deleted'))
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
}