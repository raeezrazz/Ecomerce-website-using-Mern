import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CartSummaryProps {
  itemCount: number;
  total: number;
}

export function CartSummary({ itemCount, total }: CartSummaryProps) {
  return (
    <Card className="p-6 sticky top-24">
      <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Items ({itemCount})</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-green-600">Free</span>
        </div>
        <div className="border-t pt-3 flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-primary">₹{total.toLocaleString()}</span>
        </div>
      </div>

      <Link to="/checkout">
        <Button size="lg" className="w-full mb-4">
          Proceed to Checkout
        </Button>
      </Link>

      <Link to="/shop">
        <Button variant="outline" className="w-full">
          Continue Shopping
        </Button>
      </Link>
    </Card>
  );
}
