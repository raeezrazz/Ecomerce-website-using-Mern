import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';

interface CartSummaryProps {
  itemCount: number;
  total: number;
}

export function CartSummary({ itemCount, total }: CartSummaryProps) {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state: RootState) => state.user);
  
  // Check if user is logged in
  const isLoggedIn = () => {
    const userToken = localStorage.getItem('userToken');
    const accessToken = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('userData');
    return !!(userToken || accessToken || userData || userInfo);
  };

  const handleCheckout = () => {
    if (!isLoggedIn()) {
      navigate('/auth');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <Card className="p-5 sm:p-6 rounded-2xl border shadow-sm">
      <h2 className="text-xl font-bold mb-5">Order Summary</h2>
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Items ({itemCount})</span>
          <span className="font-medium">₹{total.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-green-600 font-medium">Free</span>
        </div>
        <div className="border-t pt-4 flex justify-between font-bold text-base">
          <span>Total</span>
          <span className="text-primary">₹{total.toLocaleString()}</span>
        </div>
      </div>
      <Button size="lg" className="w-full rounded-xl font-semibold mb-3 shadow-sm hover:shadow transition-all" onClick={handleCheckout}>
        {isLoggedIn() ? 'Proceed to Checkout' : 'Login to Checkout'}
      </Button>
      <Link to="/shop" className="block">
        <Button variant="outline" className="w-full rounded-xl">Continue Shopping</Button>
      </Link>
    </Card>
  );
}
