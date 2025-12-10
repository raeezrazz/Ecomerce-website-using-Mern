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
    <Card className="p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6">
        <div className="w-full sm:w-20 md:w-24 h-48 sm:h-20 md:h-24 bg-muted rounded-md overflow-hidden flex-shrink-0">
          <img 
            src={item.images[0]} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2 mb-2">
            <Link to={`/product/${item.id}`} className="flex-1 min-w-0">
              <h3 className="font-semibold text-base sm:text-lg hover:text-primary transition line-clamp-2">{item.name}</h3>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0"
              onClick={() => onRemove(item.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mb-2">SKU: {item.sku}</p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
            <p className="text-base sm:text-lg font-bold text-primary">₹{item.price.toLocaleString()}</p>
            <div className="flex items-center border rounded-md w-fit">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-9 sm:w-9"
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <span className="px-3 sm:px-4 py-1 sm:py-2 font-semibold text-sm sm:text-base min-w-[2.5rem] sm:min-w-[3rem] text-center">{item.quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-9 sm:w-9"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                disabled={item.quantity >= item.stock}
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
