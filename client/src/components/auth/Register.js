import React, { Fragment, useState } from 'react'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'

// actions
import { setAlert } from '../../actions/alert'
import { register } from '../../actions/auth'

const Register = ({ isAuthenticated, register, setAlert }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  })

  const { name, email, password, password2 } = formData

  /**
    * in order to use the same `onChange` fn to control all our inputs,
    * we need to get the value of the `name` attribute of each element
    * to ascertain that we're only updating the germane state value,
    * therefore we use `[e.target.name]` as the key
    */
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmit = async e => {
    e.preventDefault()

    if (password !== password2) {
      setAlert('passwords do not match', 'danger')
    } else {
      // call register action with the name, email, and password
      // from our component's state
      register({ name, email, password })
    }
  }

  // redirect if registered by using <Redirect> from react-router:
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />
  }

  return (
    <Fragment>
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'><i className='fas fa-user'></i> Create Your Account</p>
      <form className='form' action='create-profile.html' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Name'
            name='name' 
            value={name}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={e => onChange(e)}
            required
          />
          <small className='form-text'>
            This site uses Gravatar so if you want a profile image, use a Gravatar email
          </small>
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
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            name='password2'
            minLength='6'
            value={password2}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Register' />
      </form>
      <p className='my-1'>
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
    </Fragment>
  )
}

Register.propTypes = {
  isAuthenticated: PropTypes.bool,
  register: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired
}

// we want to be able to read auth state to redirect after logging in
const mapStateToProps = state => ({
  // we get what we needed auth's state as defined in reducer!
  isAuthenticated: state.auth.isAuthenticated
})

/**
 * first arg to connect is any state that needs to be mapped to props
 * second is an object with any action we want to use -- this way,
 *  we can use e.g. `props.setAlert`
 */
export default connect(mapStateToProps, { register, setAlert })(Register)
