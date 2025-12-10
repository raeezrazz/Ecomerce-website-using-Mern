import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CartSummaryProps {
  itemCount: number;
  total: number;
}

export function CartSummary({ itemCount, total }: CartSummaryProps) {
  return (
    <Card className="p-4 sm:p-5 md:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Order Summary</h2>
      
      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
        <div className="flex justify-between text-sm sm:text-base">
          <span className="text-muted-foreground">Items ({itemCount})</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm sm:text-base">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-green-600">Free</span>
        </div>
        <div className="border-t pt-2 sm:pt-3 flex justify-between text-base sm:text-lg font-bold">
          <span>Total</span>
          <span className="text-primary">₹{total.toLocaleString()}</span>
        </div>
      </div>

      <Link to="/checkout" className="block mb-3 sm:mb-4">
        <Button size="lg" className="w-full text-sm sm:text-base">
          Proceed to Checkout
        </Button>
      </Link>

      <Link to="/shop" className="block">
        <Button variant="outline" className="w-full text-sm sm:text-base">
          Continue Shopping
        </Button>
      </Link>
    </Card>
  );
}
