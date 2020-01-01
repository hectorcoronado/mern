import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

// components
import Spinner from '../layout/Spinner'

// actions
import { getProfileById } from '../../actions/profile'

const Profile = ({
  auth,
  getProfileById,
  match,
  profile: { loading, profile }
}) => {
  useEffect(() => {
    // get id from url w/`props.match.params.id` (destructured above)
    getProfileById(match.params.id)
  }, [getProfileById])
  return (
    <>
      {profile === null || loading
        ? <Spinner />
        : (
          <>
            <Link className='btn btn-light' to='/profiles'>Back to Profiles</Link>
            {
              auth.isAuthenticated
              && auth.loading === false
              && auth.user._id === profile.user._id
              && (
                <Link className='btn btn-dark' to='/edit-profile'>
                  Edit Profile
                </Link>
              )
            }
          </>
          )
      }
      
    </>
  )
}

Profile.propTypes = {
  auth: PropTypes.object.isRequired,
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
}

/**
 * we need `auth` because if a user's logged in, & the profile they're
 * viewing is their own, we want to render an `Edit` button
 * @param {Object} state 
 */
const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
})

export default connect(mapStateToProps, { getProfileById })(Profile)
