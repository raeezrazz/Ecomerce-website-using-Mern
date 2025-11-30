import { Routes, Route } from 'react-router-dom';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Users from '@/pages/Users';
import Products from '@/pages/Products';
import Categories from '@/pages/Categories';
import Orders from '@/pages/Orders';
import SalesReport from '@/pages/SalesReport';
import Tally from '@/pages/Tally';
import Settings from '@/pages/Settings';
import Warehouse from '@/pages/Warehouse';

function AdminRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Dashboard/>}/>
      <Route path="/login" element={<Login />} />
      <Route path="/users" element={<Users />} />
      <Route path="/products" element={<Products />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/sales" element={<SalesReport />} />
      <Route path="/tally" element={<Tally />} />
      <Route path="/warehouse" element={<Warehouse />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default AdminRoutes;
