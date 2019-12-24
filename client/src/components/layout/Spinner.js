import React from 'react'

import spinner from './spinner.gif'

const Spinner = () => {
  const spinnerStyle = {
    display: 'block',
    margin: 'auto',
    width: '200px'
  }
  return (
    <>
      <img
        alt='Loading...'
        src={spinner}
        style={spinnerStyle}
      />
    </>
  )
}

export default Spinner
