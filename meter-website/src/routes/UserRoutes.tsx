import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from '../Pages/Client/Home';
import ContactUs from '../Pages/Client/ContactUs';
import Shop from '../Pages/Client/Shop';
import ProductPage from '../Pages/Client/ProductPage';
import Cart from '../Pages/Client/Cart';
import Checkout from '../Pages/Client/Checkout';

function UserRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/contact-us' element={<ContactUs/>} />
      <Route path='/shop' element={<Shop/>} />
      <Route path='/product' element={<ProductPage/>} />
      <Route path='/cart' element={<Cart/>} />
      <Route path='/checkout' element={<Checkout/>} />




    </Routes>
  )
}

export default UserRoutes
