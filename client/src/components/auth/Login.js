import React, { Fragment, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { login } from '../../actions/auth'

const Login = ({ isAuthenticated, login }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const { email, password } = formData

  /**
    * in order to use the same `onChange` fn to control all our inputs,
    * we need to get the value of the `name` attribute of each element
    * to ascertain that we're only updating the germane state value,
    * therefore we use `[e.target.name]` as the key
    */
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmit = async e => {
    e.preventDefault()

    // in order to log in, we only need the user's email & password
    login(email, password)
  }

  // redirect if logged in by using <Redirect> from react-router:
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />
  }

  return (
    <Fragment>
      <h1 className='large text-primary'>Sign In</h1>
      <p className='lead'><i className='fas fa-user'></i> Sign In to Your Account</p>
      <form className='form' action='create-profile.html' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            minLength='6'
            value={password}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Login' />
      </form>
      <p className='my-1'>
        Don't have an account? <Link to='/register'>Sign Up</Link>
      </p>
    </Fragment>
  )
}

Login.propTypes = {
  isAuthenticated: PropTypes.bool,
  login: PropTypes.func.isRequired
}

// we want to be able to read auth state to redirect after logging in
const mapStateToProps = state => ({
  // we get what we needed auth's state as defined in reducer!
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { login })(Login)
