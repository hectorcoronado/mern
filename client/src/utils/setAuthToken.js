import axios from 'axios'

/**
 * defines a function that takes in a token:
 *  - if the token is there, it adds it to the headers
 *  - otherwise, it deletes it from the headers
 * 
 * we're not making a request with axios, we're adding
 * this token to every request we make with it if it's
 * available
 */

const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token
  } else {
    delete axios.defaults.headers.common['x-auth-token']
  }
}

export default setAuthToken