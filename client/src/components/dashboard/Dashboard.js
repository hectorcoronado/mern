import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// components
import DashboardActions from './DashboardActions'
import Education from './Education'
import Experience from './Experience'
import Spinner from '../layout/Spinner'

// actions
import { getCurrentProfile } from '../../actions/profile'

const Dashboard = ({ 
    auth: { user },
    getCurrentProfile,
    profile: { loading, profile }
  }) => {
    useEffect(() => {
      getCurrentProfile()
    }, [])

    return loading && profile === null
      ? <Spinner />
      : (
        <>
          <h1 className='large text-primary'>
            Dashboard
          </h1>
          <p className='lead'>
            <i className='fas fa-user' />
            {' '}Welcome { user && user.name }
          </p>
          { profile !== null
              ? (
                <>
                  <DashboardActions />
                  <Experience experience={profile.experience} />
                  <Education education={profile.education} />
                </>
              )
              : (
                <>
                  <p>You have not yet set up a profile, please add some info:</p>
                  <Link to='/create-profile' className='btn btn-primary my-1'>
                    Create Profile
                  </Link>
                </>
              )
          }
        </>
      )
}

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
})

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard)