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
  const thumb = item.images?.[0] ?? '';
  return (
    <Card className="p-3 sm:p-4 rounded-xl border border-border/80 bg-card/95 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/10">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="w-full sm:w-20 h-36 sm:h-20 bg-muted/40 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
          <img src={thumb} alt={item.name} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2 mb-1.5">
            <Link to={`/product/${item.id}`} className="flex-1 min-w-0 group/title">
              <h3 className="font-medium text-sm sm:text-base hover:text-primary transition-colors line-clamp-2 leading-snug">
                {item.name}
              </h3>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0 rounded-md text-muted-foreground hover:text-destructive transition-colors"
              onClick={() => onRemove(item.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
            {item.offerPrice && item.offerPrice > 0 && item.actualPrice ? (
              <div>
                <p className="text-sm font-bold text-primary">₹{item.offerPrice.toLocaleString()}</p>
                <p className="text-[11px] text-muted-foreground line-through">
                  ₹{(item.actualPrice || item.price || 0).toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="text-sm font-bold text-primary">₹{(item.actualPrice || item.price || 0).toLocaleString()}</p>
            )}
            <div className="flex items-center border rounded-lg bg-background/80 h-8 w-fit shadow-sm">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-none rounded-l-lg"
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="px-2.5 min-w-[2rem] text-center text-xs font-semibold tabular-nums">{item.quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-none rounded-r-lg"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                disabled={item.quantity >= item.stock}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
