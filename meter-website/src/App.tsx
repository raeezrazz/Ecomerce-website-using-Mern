import { useState } from 'react'
import { Route,BrowserRouter as Router ,Routes } from 'react-router-dom'
import Home from './Pages/Client/Home'
import './App.css'

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>} />
      </Routes>
    </Router>

    )
}

export default App
