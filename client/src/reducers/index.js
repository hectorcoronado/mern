// ROOT REDUCER
import { combineReducers } from 'redux'

// reducers
import alert from './alert'

/**
 * @param Object of all reducers we create
 */
export default combineReducers({
  alert
})