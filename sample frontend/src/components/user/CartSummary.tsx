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

      <Button 
        size="lg" 
        className="w-full text-sm sm:text-base mb-3 sm:mb-4"
        onClick={handleCheckout}
      >
        {isLoggedIn() ? 'Proceed to Checkout' : 'Login to Checkout'}
      </Button>

      <Link to="/shop" className="block">
        <Button variant="outline" className="w-full text-sm sm:text-base">
          Continue Shopping
        </Button>
      </Link>
    </Card>
  );
}
