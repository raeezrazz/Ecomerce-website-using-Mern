import { Routes, Route, Navigate } from 'react-router-dom';
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
import { AdminProtected } from '@/components/auth/AdminProtected';
import { AuthGuard } from '@/components/auth/AuthGuard';

function AdminRoutes() {
  return (
    <Routes>
      {/* Public admin login route - redirects if already logged in */}
      <Route element={<AuthGuard />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Protected admin routes - require admin authentication */}
      <Route element={<AdminProtected />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/sales" element={<SalesReport />} />
        <Route path="/tally" element={<Tally />} />
        <Route path="/warehouse" element={<Warehouse />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      
      {/* Catch-all: redirect any unmatched admin routes to login */}
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
}

export default AdminRoutes;
