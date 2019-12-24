import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

// actions
import { logout } from '../../actions/auth'

/**
 * Navbar component takes in/destructures from auth state:
 *  `isAuthenticated`
 *  `loading` 
 * ...so that we can ascertain if/when user's logged in to render right links
 */
const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  const authLinks = (
    <ul>
      <li>
        <i className='fas fa-user' />{' '}
        <span className='hide-sm'><Link to='/dashboard'>Dashboard</Link></span>
      </li>
      <li>
        <a onClick={logout} href='#!'>
          <i className='fas fa-sign-out-alt' />{' '}
          <span className='hide-sm'>Logout</span>
        </a>
      </li>
    </ul>
  )

  const guestLinks = (
    <ul>
      <li><a href='#!'>Developers</a></li>
      <li><Link to='/register'>Register</Link></li>
      <li><Link to='/login'>Login</Link></li>
    </ul>
  )
  return (
  <nav className='navbar bg-dark'>
    <h1>
      <Link to='/'>
        <i className='fas fa-code'></i> DevConnector
      </Link>
    </h1>

    {
      !loading && (
        <>
          { isAuthenticated ? authLinks : guestLinks}
        </>
      )
    }

  </nav>
  )
}

Navbar.propTypes = {
  auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, { logout })(Navbar)