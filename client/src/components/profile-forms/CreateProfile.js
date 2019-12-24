import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'

// actions
import { createProfile } from '../../actions/profile'

const CreateProfile = ({ createProfile, history }) => {
  const [formData, setFormData] = useState({
    bio: '',
    company: '',
    facebook: '',
    githubusername: '',
    instagram: '',
    linkedin: '',
    location: '',
    skills: '',
    status: '',
    twitter: '',
    youtube: '',
    website: ''
  })

  const [displaySocialInputs, toggleSocialInputs] = useState(false)
  
  const {
    bio,
    company,
    facebook,
    githubusername,
    instagram,
    linkedin,
    location,
    skills,
    status,
    twitter,
    youtube,
    website
  } = formData

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmit = e => {
    e.preventDefault()

    createProfile(formData, history)
  }

  return (
    <>
      <h1 className="large text-primary">
        Create Your Profile
      </h1>
      <p className="lead">
        <i className="fas fa-user"></i> Let's get some information to make your
        profile stand out
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <select
            name="status"
            onChange={e => onChange(e)}
            value={status} 
          >
            <option value="0">* Select Professional Status</option>
            <option value="Developer">Developer</option>
            <option value="Junior Developer">Junior Developer</option>
            <option value="Senior Developer">Senior Developer</option>
            <option value="Manager">Manager</option>
            <option value="Student or Learning">Student or Learning</option>
            <option value="Instructor">Instructor or Teacher</option>
            <option value="Intern">Intern</option>
            <option value="Other">Other</option>
          </select>
          <small className="form-text">
            Give us an idea of where you are at in your career
          </small>
        </div>
        <div className="form-group">
          <input
            name="company"
            onChange={e => onChange(e)}
            placeholder="Company"
            type="text"
            value={company} 
          />
          <small className="form-text">
            Could be your own company or one you work for
          </small>
        </div>
        <div className="form-group">
          <input
            name="website"
            onChange={e => onChange(e)}
            placeholder="Website"
            type="text"
            value={website}
          />
          <small className="form-text">
            Could be your own or a company website
          </small>
        </div>
        <div className="form-group">
          <input
            name="location"
            onChange={e => onChange(e)}
            placeholder="Location"
            type="text"
            value={location}
          />
          <small className="form-text">
            City/state suggested (eg. Boston, MA)
          </small>
        </div>
        <div className="form-group">
          <input
            name="skills"
            onChange={e => onChange(e)}
            placeholder="Skills"
            type="text"
            value={skills}
          />
          <small className="form-text">
            Please use comma separated values (eg.
            HTML,CSS,JavaScript,PHP)
          </small>
        </div>
        <div className="form-group">
          <input
            name="githubusername"
            onChange={e => onChange(e)}
            placeholder="Github Username"
            type="text"
            value={githubusername}
          />
          <small className="form-text">
            If you want your latest repos and a Github link, include your username
          </small>
        </div>
        <div className="form-group">
          <textarea
            placeholder="A short bio of yourself"
            name="bio"
            onChange={e => onChange(e)}
            value={bio}
          />
          <small className="form-text">Tell us a little about yourself</small>
        </div>

        <div className="my-2">
          <button onClick={() => toggleSocialInputs(!displaySocialInputs)} type="button" className="btn btn-light">
            Add Social Network Links
          </button>
          <span>Optional</span>
        </div>

        {
          displaySocialInputs && (
            <>
              <div className="form-group social-input">
                <i className="fab fa-twitter fa-2x"></i>
                <input
                  name="twitter"
                  onChange={e => onChange(e)}
                  placeholder="Twitter URL"
                  type="text"
                  value={twitter}
                />
              </div>

              <div className="form-group social-input">
                <i className="fab fa-facebook fa-2x"></i>
                <input
                  name="facebook"
                  onChange={e => onChange(e)}
                  placeholder="Facebook URL"
                  type="text"
                  value={facebook}
                />
              </div>

              <div className="form-group social-input">
                <i className="fab fa-youtube fa-2x"></i>
                <input
                  name="youtube"
                  onChange={e => onChange(e)}
                  placeholder="YouTube URL"
                  type="text"
                  value={youtube}
                />
              </div>

              <div className="form-group social-input">
                <i className="fab fa-linkedin fa-2x"></i>
                <input type="text" placeholder="Linkedin URL" name="linkedin"
                  name="linkedin"
                  onChange={e => onChange(e)}
                  placeholder="LinkedIn URL"
                  type="text"
                  value={linkedin}
                />
              </div>

              <div className="form-group social-input">
                <i className="fab fa-instagram fa-2x"></i>
                <input
                  name="instagram"
                  onChange={e => onChange(e)}
                  placeholder="Instagram URL"
                  type="text"
                  value={instagram}
                />
              </div>
            </>
          )
        }

        <input type="submit" className="btn btn-primary my-1" />
        <a className="btn btn-light my-1" href="dashboard.html">Go Back</a>
      </form>
    </>
  )
}

CreateProfile.propTypes = {
  createProfile: PropTypes.func.isRequired
}

/**
 * we need to wrap our component with `withRouter`
 * so that we can use the `history` object in call to
 * `createProfile` action
 */
export default connect(null, { createProfile })(withRouter(CreateProfile))