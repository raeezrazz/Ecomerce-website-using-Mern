import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Order } from '@/types';

interface OrderHistoryProps {
  orders: Order[];
}

export function OrderHistory({ orders }: OrderHistoryProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'default';
      case 'Shipped': return 'secondary';
      case 'Processing': return 'secondary';
      case 'Pending': return 'outline';
      case 'Cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="rounded-xl border border-border/80 bg-card/95 shadow-soft overflow-hidden">
      <div className="px-4 py-3 border-b border-border/70 bg-muted/20">
        <h2 className="text-sm font-semibold text-foreground tracking-tight">Orders</h2>
        <p className="text-[11px] text-muted-foreground mt-0.5">Track shipments</p>
      </div>
      <div className="p-3 sm:p-4 space-y-2.5">
        {orders.map((order, index) => (
          <div
            key={order.id}
            className="rounded-lg border border-border/70 bg-background/60 p-3 sm:p-4 hover:border-primary/15 hover:shadow-sm transition-all duration-200 opacity-0 motion-safe:animate-fade-in-up animate-fill-both"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
              <div>
                <h3 className="font-medium text-sm text-foreground font-mono">{order.id}</h3>
                <p className="text-[11px] text-muted-foreground">{order.orderDate}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <p className="font-bold text-sm text-primary tabular-nums">₹{order.totalAmount.toLocaleString()}</p>
                <Badge variant={getStatusColor(order.deliveryStatus)} className="rounded-md text-[10px] px-2 py-0">
                  {order.deliveryStatus}
                </Badge>
              </div>
            </div>

            <div className="space-y-0.5 mb-3">
              {order.items.map((item, idx) => (
                <p key={idx} className="text-xs text-muted-foreground leading-snug">
                  {item.productName} × {item.quantity}
                </p>
              ))}
            </div>

            <div className="pt-3 border-t border-border/60 flex flex-wrap justify-between items-center gap-2">
              <p className="text-[11px] text-muted-foreground">
                Payment:{' '}
                <span
                  className={
                    order.paymentStatus === 'Paid'
                      ? 'text-green-600 dark:text-green-400 font-medium'
                      : 'text-orange-600 dark:text-orange-400 font-medium'
                  }
                >
                  {order.paymentStatus}
                </span>
              </p>
              <Button variant="outline" size="sm" className="rounded-lg h-8 text-xs px-3">
                Track
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
