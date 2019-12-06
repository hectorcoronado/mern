import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const Alert = ({ alerts }) => 
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map(alert => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ))

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
}

/**
 * create variable that takes redux state, and maps it to
 * a prop within this component -- it's a function that takes state
 * as a parameter and returns an object; 
 * whatever state we want, we can use by setting a key's value to 
 * some piece of state definied in our root reducer
 */
const mapStateToProps = state => ({
  alerts: state.alert
})

export default connect(mapStateToProps)(Alert)