import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from '../Pages/Client/Home';
import ContactUs from '../Pages/Client/ContactUs';
function UserRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/contact-us' element={<ContactUs/>} />
    </Routes>
  )
}

export default UserRoutes
