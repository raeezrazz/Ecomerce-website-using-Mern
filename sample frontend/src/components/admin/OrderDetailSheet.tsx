import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateOrderStatus } from '@/api/adminApi';
import type { Order } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface OrderDetailSheetProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onOrderUpdate?: () => void;
}

export function OrderDetailSheet({ order, open, onClose, onOrderUpdate }: OrderDetailSheetProps) {
  const { toast } = useToast();
  const [deliveryStatus, setDeliveryStatus] = useState<Order['deliveryStatus']>('Pending');
  const [paymentStatus, setPaymentStatus] = useState<Order['paymentStatus']>('Unpaid');

  useEffect(() => {
    if (order) {
      setDeliveryStatus(order.deliveryStatus);
      setPaymentStatus(order.paymentStatus);
    }
  }, [order]);

  if (!order) return null;

  const handleDeliveryStatusChange = async (status: Order['deliveryStatus']) => {
    try {
      await updateOrderStatus(order.id, status, 'delivery');
      setDeliveryStatus(status);
      toast({
        title: 'Status Updated',
        description: 'Delivery status has been updated successfully.',
      });
      onOrderUpdate?.();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to update status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handlePaymentStatusChange = async (status: Order['paymentStatus']) => {
    try {
      await updateOrderStatus(order.id, status, 'payment');
      setPaymentStatus(status);
      toast({
        title: 'Status Updated',
        description: 'Payment status has been updated successfully.',
      });
      onOrderUpdate?.();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to update status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: Order['deliveryStatus']) => {
    const variants: Record<Order['deliveryStatus'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
      Pending: 'secondary',
      Processing: 'default',
      Shipped: 'default',
      Delivered: 'outline',
      Cancelled: 'destructive',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getPaymentBadge = (status: Order['paymentStatus']) => {
    return (
      <Badge variant={status === 'Paid' ? 'default' : 'destructive'}>
        {status}
      </Badge>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Order Details</SheetTitle>
          <SheetDescription>View and manage order information</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">{order.id}</h3>
            <div className="flex gap-2">
              {getStatusBadge(deliveryStatus)}
              {getPaymentBadge(paymentStatus)}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground">Customer</Label>
              <p className="font-medium">{order.customerName}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Shipping Address</Label>
              <p>{order.shippingAddress}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Order Date</Label>
              <p>{new Date(order.orderDate).toLocaleDateString()}</p>
            </div>
          </div>

          <Separator />

          <div>
            <Label className="text-muted-foreground mb-2">Order Items</Label>
            <div className="space-y-3 mt-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total</span>
            <span>₹{order.totalAmount.toLocaleString()}</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Update Delivery Status</Label>
              <Select value={deliveryStatus} onValueChange={handleDeliveryStatusChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Update Payment Status</Label>
              <Select value={paymentStatus} onValueChange={handlePaymentStatusChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Unpaid">Unpaid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
