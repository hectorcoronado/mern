import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'

// actions
import { addExperience } from '../../actions/profile'

const AddExperience = ({ addExperience, history }) => {
  const [formData, setFormData] = useState({
    company: '',
    current: false,
    description: '',
    from: '',
    location: '',
    title: '',
    to: '',
  })

  const [toDateDisabled, toggleDisabled] = useState(false)

  const {
    company,
    current,
    description,
    location,
    from,
    title,
    to
  } = formData

  const onChange = e => setFormData({
    ...formData,
    [e.target.name]: e.target.value
  })

  const onSubmit = e => {
    e.preventDefault()

    addExperience(formData, history)
  }

  return (
    <>
      <h1 className="large text-primary">
        Add An Experience
      </h1>
      <p className="lead">
        <i className="fas fa-code-branch"></i> Add any developer/programming
        positions that you have had in the past
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            name="title"
            placeholder="* Job Title"
            onChange={e => onChange(e)}
            required
            type="text"
            value={title}
          />
        </div>
        <div className="form-group">
          <input
            name="company"
            placeholder="* Company"
            onChange={e => onChange(e)}
            required
            type="text"
            value={company}
          />
        </div>
        <div className="form-group">
          <input
            name="location"
            placeholder="Location"
            onChange={e => onChange(e)}
            type="text"
            value={location}
          />
        </div>
        <div className="form-group">
          <h4>From Date</h4>
          <input
            name="from"
            onChange={e => onChange(e)}
            type="date"
            value={from}
          />
        </div>
        <div className="form-group">
          <p>
            <input
              checked={current}
              name="current"
              onChange={e => {
                setFormData({ ...formData, current: !current })
                toggleDisabled(!toDateDisabled)
              }}
              type="checkbox"
              value={current}
            />
            {' '}Current Job
          </p>
        </div>
        <div className="form-group">
          <h4>To Date</h4>
          <input
            disabled={toDateDisabled ? 'disabled' : ''}
            name="to"
            onChange={e => onChange(e)}
            type="date"
            value={to}
          />
        </div>
        <div className="form-group">
          <textarea
            cols="30"
            name="description"
            onChange={e => onChange(e)}
            placeholder="Job Description"
            rows="5"
            value={description}
          />
        </div>
        <input type="submit" className="btn btn-primary my-1" />
        <a className="btn btn-light my-1" href="dashboard.html">Go Back</a>
      </form>
    </>
  )
}

AddExperience.propTypes = {
  addExperience: PropTypes.func.isRequired
}

export default connect(null, { addExperience })(AddExperience)
