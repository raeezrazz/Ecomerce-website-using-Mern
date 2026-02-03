import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  FolderTree,
  ShoppingCart,
  BarChart3,
  Calculator,
  Warehouse as WarehouseIcon,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const allNavItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', adminOnly: false },
  { to: '/admin/users', icon: Users, label: 'Users', adminOnly: true },
  { to: '/admin/products', icon: Package, label: 'Products', adminOnly: false },
  { to: '/admin/categories', icon: FolderTree, label: 'Categories', adminOnly: false },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Orders', adminOnly: false },
  { to: '/admin/sales', icon: BarChart3, label: 'Sales Report', adminOnly: false },
  { to: '/admin/tally', icon: Calculator, label: 'Daily Tally', adminOnly: false },
  { to: '/admin/warehouse', icon: WarehouseIcon, label: 'Warehouse', adminOnly: false },
  { to: '/admin/settings', icon: Settings, label: 'Settings', adminOnly: false },
];

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    // Get user role from localStorage
    const adminUser = localStorage.getItem('adminUser');
    if (adminUser) {
      try {
        const user = JSON.parse(adminUser);
        setUserRole(user.role || '');
      } catch {
        setUserRole('');
      }
    }
  }, []);

  // Filter nav items based on role
  const navItems = allNavItems.filter(item => {
    if (item.adminOnly) {
      return userRole === 'admin';
    }
    return true;
  });
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen bg-sidebar transition-transform duration-300 ease-in-out',
          'lg:fixed lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'w-64 lg:w-64'
        )}
      >
        <div className="flex h-full flex-col overflow-hidden">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-6 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                RM
              </div>
              <span className="font-bold text-sidebar-foreground text-lg">RsMeters</span>
            </div>
            <button
              onClick={onToggle}
              className="lg:hidden text-sidebar-foreground hover:text-primary"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 min-h-0">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/admin'}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                      )
                    }
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-sidebar-border p-4 flex-shrink-0">
            <p className="text-xs text-sidebar-foreground/60 text-center">
              © 2025 RsMeters Admin
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
