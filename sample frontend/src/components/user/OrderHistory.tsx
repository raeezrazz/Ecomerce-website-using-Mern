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
    <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
      <div className="p-6 border-b border-border/80">
        <h2 className="text-2xl font-bold text-foreground">Order History</h2>
        <p className="text-sm text-muted-foreground mt-1">View and track your orders</p>
      </div>
      <div className="p-4 sm:p-6 space-y-4">
        {orders.map((order, index) => (
          <div
            key={order.id}
            className="rounded-xl border border-border bg-background/50 p-4 sm:p-5 hover:shadow-soft transition-shadow"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
              <div>
                <h3 className="font-semibold text-lg text-foreground">{order.id}</h3>
                <p className="text-sm text-muted-foreground">{order.orderDate}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:text-right">
                <p className="font-bold text-lg text-primary">₹{order.totalAmount.toLocaleString()}</p>
                <Badge variant={getStatusColor(order.deliveryStatus)} className="rounded-lg">{order.deliveryStatus}</Badge>
              </div>
            </div>
            
            <div className="space-y-1 mb-4">
              {order.items.map((item, idx) => (
                <p key={idx} className="text-sm text-muted-foreground">
                  {item.productName} × {item.quantity}
                </p>
              ))}
            </div>
            
            <div className="pt-4 border-t border-border/80 flex flex-wrap justify-between items-center gap-2">
              <p className="text-sm text-muted-foreground">
                Payment: <span className={order.paymentStatus === 'Paid' ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}>
                  {order.paymentStatus}
                </span>
              </p>
              <Button variant="outline" size="sm" className="rounded-xl">Track Order</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
