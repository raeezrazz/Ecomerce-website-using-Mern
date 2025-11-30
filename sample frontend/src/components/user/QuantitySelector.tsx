import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  maxQuantity: number;
  onQuantityChange: (quantity: number) => void;
}

export function QuantitySelector({ quantity, maxQuantity, onQuantityChange }: QuantitySelectorProps) {
  return (
    <div className="flex items-center border rounded-md">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="px-6 py-2 font-semibold">{quantity}</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onQuantityChange(Math.min(maxQuantity, quantity + 1))}
        disabled={quantity >= maxQuantity}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
