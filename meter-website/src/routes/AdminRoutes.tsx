import React from 'react'
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../Pages/Admin/LoginPage';
import HomePage from '../Pages/Admin/HomePage';
LoginPage
function AdminRoutes() {
  return (
    <div>
       <Routes>
        <Route path='/' element={<HomePage/>}/>
      <Route path="/login" element={<LoginPage />} />
     



    </Routes>
    </div>
  )
}

export default AdminRoutes
