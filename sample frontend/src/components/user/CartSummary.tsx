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
    <Card className="relative p-4 sm:p-5 rounded-xl border border-border/80 bg-card/95 shadow-soft overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary/40 via-primary to-primary/40 opacity-80 pointer-events-none" />
      <h2 className="text-sm font-semibold mb-4 tracking-tight">Summary</h2>
      <div className="space-y-2.5 mb-4 text-xs sm:text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Items ({itemCount})</span>
          <span className="font-medium tabular-nums">₹{total.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-green-600 font-medium">Free</span>
        </div>
        <div className="border-t border-border/70 pt-3 flex justify-between font-bold text-sm">
          <span>Total</span>
          <span className="text-primary tabular-nums">₹{total.toLocaleString()}</span>
        </div>
      </div>
      <Button
        className="w-full rounded-lg h-10 text-sm font-semibold mb-2 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
        onClick={handleCheckout}
      >
        {isLoggedIn() ? 'Checkout' : 'Login to checkout'}
      </Button>
      <Link to="/shop" className="block">
        <Button variant="outline" className="w-full rounded-lg h-9 text-xs">
          Continue shopping
        </Button>
      </Link>
    </Card>
  );
}
