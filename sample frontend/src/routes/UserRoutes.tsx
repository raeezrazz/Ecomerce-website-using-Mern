import { Routes, Route } from "react-router-dom";
import Home from "@/pages/user/Home";

import Shop from "@/pages/user/Shop";
import ProductDetail from "@/pages/user/ProductDetail";
import Cart from "@/pages/user/Cart";
import Checkout from "@/pages/user/Checkout";
import Profile from "@/pages/user/Profile";
import UserProtected from "@/components/user/UserProtected";
import UsersLayout from '../components/layout/UserLayout'
import Auth from "@/pages/user/Auth";

function UserRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth/>} />

      <Route element={<UsersLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        
        <Route element={<UserProtected />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default UserRoutes;
