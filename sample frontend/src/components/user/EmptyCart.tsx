import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';

export function EmptyCart() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 text-center">
      <div className="inline-flex h-24 w-24 items-center justify-center rounded-2xl bg-muted mb-6 animate-fade-in-up">
        <ShoppingBag className="h-12 w-12 text-muted-foreground" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 animate-fade-in-up animate-delay-100 animate-fill-both opacity-0">Your cart is empty</h1>
      <p className="text-muted-foreground mb-8 animate-fade-in-up animate-delay-200 animate-fill-both opacity-0">Add some products to get started.</p>
      <Link to="/shop" className="animate-fade-in-up animate-delay-300 animate-fill-both opacity-0 inline-block">
        <Button size="lg" className="rounded-xl font-semibold shadow-sm hover:shadow transition-all">
          Continue Shopping
        </Button>
      </Link>
    </div>
  );
}
