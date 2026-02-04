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
          'fixed left-0 top-0 z-50 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out',
          'lg:translate-x-0 lg:shadow-soft-lg',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col overflow-hidden">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-soft">
                RM
              </div>
              <span className="font-display font-bold text-sidebar-foreground text-lg tracking-tight">RsMeters</span>
            </div>
            <button
              onClick={onToggle}
              className="lg:hidden p-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-primary transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-5 min-h-0">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/admin'}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                          : 'text-sidebar-foreground/90 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                      )
                    }
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0 opacity-90" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-sidebar-border px-4 py-4 flex-shrink-0">
            <p className="text-xs text-sidebar-foreground/60 text-center">
              © 2025 RsMeters Admin
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
