import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className='notfound'>
        <h2>Sorry</h2>
        <p>Page cannot be found</p>
        <Link to="/">Go Back to the Homepage</Link>
    </div>
  )
}

export default NotFound;