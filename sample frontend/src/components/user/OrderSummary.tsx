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
    <Card className="relative p-4 sm:p-5 rounded-xl border border-border/80 bg-card/95 shadow-soft overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary/40 via-primary to-primary/40 opacity-80 pointer-events-none" />
      <h2 className="text-sm font-semibold mb-3 tracking-tight">Order</h2>

      <div className="space-y-2 mb-4 max-h-40 sm:max-h-52 overflow-y-auto text-xs pr-0.5">
        {items.map((item) => {
          const actualPrice = item.actualPrice || item.price || 0;
          const itemPrice = item.offerPrice && item.offerPrice > 0 ? item.offerPrice : actualPrice;
          return (
            <div key={item.id} className="flex justify-between gap-2">
              <span className="text-muted-foreground line-clamp-2 flex-1 leading-snug">
                {item.name} × {item.quantity}
              </span>
              <span className="flex-shrink-0 tabular-nums font-medium">₹{(itemPrice * item.quantity).toLocaleString()}</span>
            </div>
          );
        })}
      </div>

      <div className="space-y-2 mb-4 text-xs sm:text-sm">
        <div className="border-t border-border/70 pt-3 flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="tabular-nums">₹{total.toLocaleString()}</span>
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

      {showPlaceOrder && (
        <>
          <Button
            type="submit"
            className="w-full h-10 rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
          >
            Place order
          </Button>

          <p className="text-[10px] text-muted-foreground text-center mt-3 leading-relaxed">
            By placing your order, you agree to our terms.
          </p>
        </>
      )}
    </Card>
  );
}
