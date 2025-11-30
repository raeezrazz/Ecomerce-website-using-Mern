import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-muted border-t mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">RsMeters</h3>
            <p className="text-muted-foreground">Your trusted source for digital speedometers and meter parts.</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-muted-foreground hover:text-primary transition">Shop</Link></li>
              <li><Link to="/shop?category=Digital Meters" className="text-muted-foreground hover:text-primary transition">Digital Meters</Link></li>
              <li><Link to="/shop?category=Meter Spares" className="text-muted-foreground hover:text-primary transition">Meter Spares</Link></li>
              <li><Link to="/shop?category=Accessories" className="text-muted-foreground hover:text-primary transition">Accessories</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link to="/profile" className="text-muted-foreground hover:text-primary transition">My Account</Link></li>
              <li><Link to="/cart" className="text-muted-foreground hover:text-primary transition">Shopping Cart</Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition">Track Order</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition">Returns</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-center text-muted-foreground">
                <Phone className="h-4 w-4 mr-2" />
                +91-9876543210
              </li>
              <li className="flex items-center text-muted-foreground">
                <Mail className="h-4 w-4 mr-2" />
                info@rsmeters.com
              </li>
              <li className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                Mumbai, India
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 RsMeters. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
