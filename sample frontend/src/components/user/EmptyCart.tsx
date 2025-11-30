import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';

export function EmptyCart() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
      <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
      <p className="text-muted-foreground mb-8">Add some products to get started!</p>
      <Link to="/shop">
        <Button size="lg">Continue Shopping</Button>
      </Link>
    </div>
  );
}
