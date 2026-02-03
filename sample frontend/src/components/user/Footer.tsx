import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-muted border-t mt-8 sm:mt-12 md:mt-16 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg sm:text-xl font-bold text-primary mb-3 sm:mb-4">RsMeters</h3>
            <p className="text-sm sm:text-base text-muted-foreground">Your trusted source for digital speedometers and meter parts.</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition">Shop</Link></li>
              <li><Link to="/shop?category=Digital Meters" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition">Digital Meters</Link></li>
              <li><Link to="/shop?category=Meter Spares" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition">Meter Spares</Link></li>
              <li><Link to="/shop?category=Accessories" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition">Accessories</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link to="/profile" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition">My Account</Link></li>
              <li><Link to="/cart" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition">Shopping Cart</Link></li>
              <li><a href="#" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition">Track Order</a></li>
              <li><a href="#" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition">Returns</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-center text-sm sm:text-base text-muted-foreground">
                <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="break-all">+91-9876543210</span>
              </li>
              <li className="flex items-center text-sm sm:text-base text-muted-foreground">
                <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="break-all">info@rsmeters.com</span>
              </li>
              <li className="flex items-center text-sm sm:text-base text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Mumbai, India</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-muted-foreground">
          <p>&copy; 2024 RsMeters. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
