import React from 'react'
import { Link, useLocation } from 'react-router-dom'

import '../styles/navigation.scss'

const Navigation = () => {
  const loc = useLocation()

  return (
    <nav className='nav'>
      <Link
        className={`nav-link ${loc.pathname == '/' ? 'active' : ''}`}
        to='/'
      >
        Morse
      </Link>
      <Link
        className={`nav-link ${loc.pathname == '/rates' ? 'active' : ''}`}
        to='/rates'
      >
        Rates
      </Link>
    </nav>
  )
}

export default Navigation
