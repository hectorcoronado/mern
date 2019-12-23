import React from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'

/**
 * @param {component} Component passed in in `App.js`
 * @param {auth} state auth property mapped to props
 * @param {...rest}  anyOtherProps that get passed in
 */
const PrivateRoute = ({
    component: Component,
    auth: { isAuthenticated, loading },
    ...rest 
  }) => (
    <Route {...rest} render={ props => !isAuthenticated && !loading
      ? (<Redirect to='/login' />)
      : (<Component {...props}/>) 
    } />
)

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps)(PrivateRoute)