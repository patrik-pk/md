import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import Navigation from './components/Navigation'
import Morse from './components/Morse'
import Rates from './components/Rates'

import './styles/reset.scss'
import './styles/main.scss'

const App = () => {
  return (
    <div className='app'>
      <Navigation />

      <main className='app-content'>
        <Routes>
          <Route path='/' element={<Morse />} />
          <Route path='/rates' element={<Rates />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
