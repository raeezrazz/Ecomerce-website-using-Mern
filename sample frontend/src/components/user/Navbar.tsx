import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { logout } from '@/store/Slice/userSlice';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Navbar() {
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.user);
  
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('userToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    navigate('/');
  };

  return (
    <nav className="bg-background border-b sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-14 sm:h-16 w-full">
          <Link to="/" className="text-lg sm:text-xl md:text-2xl font-bold text-primary flex-shrink-0">RsMeters</Link>
          
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6 flex-shrink-0">
            <Link to="/" className="text-sm lg:text-base text-foreground hover:text-primary transition whitespace-nowrap">Home</Link>
            <Link to="/shop" className="text-sm lg:text-base text-foreground hover:text-primary transition whitespace-nowrap">Shop</Link>
            <Link to="/shop?category=Digital Meters" className="text-sm lg:text-base text-foreground hover:text-primary transition whitespace-nowrap">Digital Meters</Link>
            <Link to="/shop?category=Meter Spares" className="text-sm lg:text-base text-foreground hover:text-primary transition whitespace-nowrap">Spares</Link>
            <Link to="/shop?category=Accessories" className="text-sm lg:text-base text-foreground hover:text-primary transition whitespace-nowrap">Accessories</Link>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-shrink-0">
            <div className="hidden lg:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search products..." className="pl-10 w-48 xl:w-64" />
              </div>
            </div>
            
            {userInfo ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full">
                    <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
                      <AvatarFallback className="text-xs sm:text-sm">{userInfo.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{userInfo.name}</DropdownMenuLabel>
                  <DropdownMenuLabel className="font-normal text-sm text-muted-foreground">
                    {userInfo.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
            )}
            
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 sm:w-5 sm:h-5 text-[10px] sm:text-xs flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            <Button variant="ghost" size="icon" className="md:hidden h-9 w-9 sm:h-10 sm:w-10" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t space-y-1">
            <div className="px-2 py-2">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search products..." className="pl-10 w-full" />
              </div>
            </div>
            <Link to="/" className="block px-2 py-2 text-sm text-foreground hover:text-primary transition rounded-md hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/shop" className="block px-2 py-2 text-sm text-foreground hover:text-primary transition rounded-md hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
            <Link to="/shop?category=Digital Meters" className="block px-2 py-2 text-sm text-foreground hover:text-primary transition rounded-md hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>Digital Meters</Link>
            <Link to="/shop?category=Meter Spares" className="block px-2 py-2 text-sm text-foreground hover:text-primary transition rounded-md hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>Spares</Link>
            <Link to="/shop?category=Accessories" className="block px-2 py-2 text-sm text-foreground hover:text-primary transition rounded-md hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>Accessories</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
