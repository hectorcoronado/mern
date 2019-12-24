// ROOT REDUCER
import { combineReducers } from 'redux'

// reducers
import alert from './alert'
import auth from './auth'
import profile from './profile'

/**
 * @param Object of all reducers we create
 */
export default combineReducers({
  alert,
  auth,
  profile
})