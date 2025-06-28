// File: src/components/admin/Sidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
// import { cn } from '@/lib/utils'; // helper for conditional classes

const links = [
  { name: 'Dashboard', path: '/admin/dashboard' },
  { name: 'Users', path: '/admin/users' },
  { name: 'Products', path: '/admin/products' },
  { name: 'Categories', path: '/admin/categories' },
  { name: 'Orders', path: '/admin/orders' },
  { name: 'Offers & Coupons', path: '/admin/offers' },
  { name: 'Reviews', path: '/admin/reviews' },
  { name: 'Returns', path: '/admin/returns' },
  { name: 'Messages', path: '/admin/messages' },
  { name: 'Inventory', path: '/admin/inventory' },
  { name: 'Analytics', path: '/admin/analytics' },
  { name: 'Settings', path: '/admin/settings' },
];

const HomePage = () => {
  const location = useLocation();

  return (
    <aside className="bg-gray-900 text-white min-h-screen w-60 p-4 sticky top-0">
      <h1 className="text-xl font-bold mb-6">RS Meter Admin</h1>
      <nav className="space-y-2">
        {links.map(link => (
          <Link
            key={link.name}
            to={link.path}
            className=
              'block py-2 px-3 rounded hover:bg-gray-800 transition'
              
            
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default HomePage;
