import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { CartItem } from '@/contexts/CartContext';

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
  onPlaceOrder?: () => void;
  showPlaceOrder?: boolean;
}

export function OrderSummary({ items, total, onPlaceOrder, showPlaceOrder = false }: OrderSummaryProps) {
  return (
    <Card className="p-6 sticky top-24">
      <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
      
      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {item.name} × {item.quantity}
            </span>
            <span>₹{(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        
        <div className="border-t pt-3 flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
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

      {showPlaceOrder && (
        <>
          <Button type="submit" size="lg" className="w-full">
            Place Order
          </Button>
          
          <p className="text-xs text-muted-foreground text-center mt-4">
            By placing your order, you agree to our terms and conditions
          </p>
        </>
      )}
    </Card>
  );
}
