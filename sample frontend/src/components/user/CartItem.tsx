import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus } from 'lucide-react';
import type { CartItem } from '@/contexts/CartContext';

interface CartItemProps {
  item: CartItem;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  return (
    <Card className="p-6">
      <div className="flex gap-6">
        <div className="w-24 h-24 bg-muted rounded-md overflow-hidden flex-shrink-0">
          <img 
            src={item.images[0]} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          <Link to={`/product/${item.id}`}>
            <h3 className="font-semibold text-lg hover:text-primary transition">{item.name}</h3>
          </Link>
          <p className="text-sm text-muted-foreground mb-2">SKU: {item.sku}</p>
          <p className="text-lg font-bold text-primary">₹{item.price.toLocaleString()}</p>
        </div>

        <div className="flex flex-col items-end justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(item.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>

          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="px-4 py-2 font-semibold">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              disabled={item.quantity >= item.stock}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
