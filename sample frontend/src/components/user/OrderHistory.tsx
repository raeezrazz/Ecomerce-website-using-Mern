import { Card } from '@/components/ui/card';
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
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Order History</h2>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{order.id}</h3>
                <p className="text-sm text-muted-foreground">{order.orderDate}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-primary">₹{order.totalAmount.toLocaleString()}</p>
                <Badge variant={getStatusColor(order.deliveryStatus)}>{order.deliveryStatus}</Badge>
              </div>
            </div>
            
            <div className="space-y-1">
              {order.items.map((item, idx) => (
                <p key={idx} className="text-sm text-muted-foreground">
                  {item.productName} × {item.quantity}
                </p>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Payment: <span className={order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-600'}>
                  {order.paymentStatus}
                </span>
              </p>
              <Button variant="outline" size="sm">Track Order</Button>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}
