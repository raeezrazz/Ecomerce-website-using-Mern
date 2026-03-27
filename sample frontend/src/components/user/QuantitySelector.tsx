import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  maxQuantity: number;
  onQuantityChange: (quantity: number) => void;
}

export function QuantitySelector({ quantity, maxQuantity, onQuantityChange }: QuantitySelectorProps) {
  return (
    <div className="flex items-center border rounded-lg bg-background/80 shadow-sm h-9">
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-none rounded-l-lg shrink-0"
        onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
      >
        <Minus className="h-3.5 w-3.5" />
      </Button>
      <span className="px-4 min-w-[2.25rem] text-center text-sm font-semibold tabular-nums">{quantity}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-none rounded-r-lg shrink-0"
        onClick={() => onQuantityChange(Math.min(maxQuantity, quantity + 1))}
        disabled={quantity >= maxQuantity}
      >
        <Plus className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
