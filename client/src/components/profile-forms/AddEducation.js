import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

// actions
import { addEducation } from '../../actions/profile'

const AddEducation = ({ addEducation, history }) => {
  const [formData, setFormData] = useState({
    current: false,
    degree: '',
    description: '',
    fieldofstudy: '',
    from: '',
    school: '',
    to: ''
  })

  const [toDateDisabled, toggleDisabled] = useState(false)

  const {
    current,
    degree,
    description,
    fieldofstudy,
    from,
    school,
    to
  } = formData

  const onChange = e => setFormData({
    ...formData,
    [e.target.name]: e.target.value
  })

  const onSubmit = e => {
    e.preventDefault()

    addEducation(formData, history)
  }

  return (
    <>
      <h1 className="large text-primary">
        Add Your Education
      </h1>
      <p className="lead">
        <i className="fas fa-code-branch"></i> Add any school or bootcamp you have attended:
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            name="school"
            placeholder="* School or Bootcamp"
            onChange={e => onChange(e)}
            required
            type="text"
            value={school}
          />
        </div>
        <div className="form-group">
          <input
            name="degree"
            placeholder="* Degree or Certificate"
            onChange={e => onChange(e)}
            required
            type="text"
            value={degree}
          />
        </div>
        <div className="form-group">
          <input
            name="fieldofstudy"
            placeholder="Field of Study"
            onChange={e => onChange(e)}
            type="text"
            value={fieldofstudy}
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
            {' '}Current School
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
            placeholder="Program Description"
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

AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired
}

export default connect(null, { addEducation })(withRouter(AddEducation))
