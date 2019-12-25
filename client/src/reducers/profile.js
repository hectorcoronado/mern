import {
  CLEAR_PROFILE,
  GET_PROFILE,
  PROFILE_ERROR,
  UPDATE_PROFILE
} from "../actions/types";

const initialState = {
  error: {}, // any errors in the request
  loading: true,
  // after logging in, user data goes here,
  // also if we visit another user's profile page
  profile: null,
  // for profile listing page, where we have list of devs
  profiles: [],
  repos: []
}

export default function (state = initialState, action) {
  const { payload, type } = action

  switch (type) {
    case CLEAR_PROFILE:
      return {
        ...state,
        loading: false,
        profile: null,
        repos: []
      }
    case GET_PROFILE:
    case UPDATE_PROFILE:
      return {
        ...state,
        loading: false,
        profile: payload
      }
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      }
    default: return state
  }
}