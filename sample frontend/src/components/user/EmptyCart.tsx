import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';

export function EmptyCart() {
  return (
    <div className="user-page-dots min-h-[55vh] flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/60 border border-border/60 mb-4 motion-safe:animate-gentle-pulse motion-reduce:animate-none">
        <ShoppingBag className="h-7 w-7 text-muted-foreground" />
      </div>
      <h1 className="font-display text-lg sm:text-xl font-semibold mb-1 motion-safe:animate-fade-in-up">Your cart is empty</h1>
      <p className="text-xs sm:text-sm text-muted-foreground mb-6 max-w-xs motion-safe:animate-fade-in-up motion-safe:animate-delay-100 motion-safe:animate-fill-both">
        Add something from the shop to get started.
      </p>
      <Link to="/shop" className="inline-block motion-safe:animate-fade-in-up motion-safe:animate-delay-200 motion-safe:animate-fill-both">
        <Button size="sm" className="rounded-lg h-9 px-5 text-sm font-medium shadow-sm hover:shadow-md transition-all">
          Browse shop
        </Button>
      </Link>
    </div>
  );
}
