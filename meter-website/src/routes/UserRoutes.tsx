import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../Pages/Client/Home";
import ContactUs from "../Pages/Client/ContactUs";
import Shop from "../Pages/Client/Shop";
import ProductPage from "../Pages/Client/ProductPage";
import Cart from "../Pages/Client/Cart";
import Checkout from "../Pages/Client/Checkout";
import Profile from "../Pages/Client/Profile";
import UserProtected from "../Components/Common/UserProtected";
import UsersLayout from "../layouts/UserLayout";
import Dashboard from "../Components/Client/ProfilePage/Dashboard";
import MyAccount from "../Components/Client/ProfilePage/MyAccount";
import Address from "../Components/Client/ProfilePage/Address";
import Settings from "../Components/Client/ProfilePage/Settings";
import Order from "../Components/Client/ProfilePage/Order";

function UserRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route element={<UsersLayout />}>
        <Route path="/shop" element={<Shop />} />
        <Route path="/contact-us" element={<ContactUs />} />
        {/* <Route path='/shop' element={<Shop/>} /> */}
        <Route path="/product" element={<ProductPage />} />
        <Route path="" element={<UserProtected />}>
          <Route path="/profile" element={<Profile />}>
            <Route index element={<MyAccount />} />
            <Route path="address" element={<Address />} />
            <Route path="orders" element={<Order />} />
            <Route path="settings" element={<Settings />} />
            {/* <Route path="orders" element={<Orders />} /> */}
          </Route>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* <Route path="/user/:userId" element={<ProfilePage />} /> */}
        </Route>
      </Route>
    </Routes>
  );
}

export default UserRoutes;
