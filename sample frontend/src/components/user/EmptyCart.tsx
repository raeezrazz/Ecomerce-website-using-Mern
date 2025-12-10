import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';

export function EmptyCart() {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16 text-center">
      <ShoppingBag className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 mx-auto text-muted-foreground mb-4 sm:mb-6" />
      <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Your cart is empty</h1>
      <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">Add some products to get started!</p>
      <Link to="/shop">
        <Button size="lg" className="text-sm sm:text-base">Continue Shopping</Button>
      </Link>
    </div>
  );
}
