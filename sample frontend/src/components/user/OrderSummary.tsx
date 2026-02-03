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
    <Card className="p-4 sm:p-5 md:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Order Summary</h2>
      
      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 max-h-48 sm:max-h-64 overflow-y-auto">
        {items.map((item) => {
          const actualPrice = item.actualPrice || item.price || 0;
          const itemPrice = item.offerPrice && item.offerPrice > 0 ? item.offerPrice : actualPrice;
          return (
            <div key={item.id} className="flex justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground line-clamp-1 flex-1 mr-2">
                {item.name} × {item.quantity}
              </span>
              <span className="flex-shrink-0">₹{(itemPrice * item.quantity).toLocaleString()}</span>
            </div>
          );
        })}
      </div>
      
      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
        <div className="border-t pt-2 sm:pt-3 flex justify-between text-sm sm:text-base">
          <span className="text-muted-foreground">Subtotal</span>
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

      {showPlaceOrder && (
        <>
          <Button type="submit" size="lg" className="w-full text-sm sm:text-base">
            Place Order
          </Button>
          
          <p className="text-xs text-muted-foreground text-center mt-3 sm:mt-4">
            By placing your order, you agree to our terms and conditions
          </p>
        </>
      )}
    </Card>
  );
}
