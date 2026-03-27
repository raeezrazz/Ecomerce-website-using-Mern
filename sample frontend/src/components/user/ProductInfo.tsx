import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/types';
import { QuantitySelector } from './QuantitySelector';

interface ProductInfoProps {
  product: Product;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
}

export function ProductInfo({ product, quantity, onQuantityChange, onAddToCart }: ProductInfoProps) {
  return (
    <div className="px-0">
      <Badge variant="secondary" className="mb-2 rounded-md text-[10px] px-2 py-0 font-medium">
        {product.category}
      </Badge>
      <h1 className="font-display text-lg sm:text-xl md:text-2xl font-semibold tracking-tight mb-3 leading-snug">
        {product.name}
      </h1>

      {product.offerPrice && product.offerPrice > 0 && product.actualPrice ? (
        <div className="mb-4">
          <div className="text-xl sm:text-2xl font-bold text-primary">₹{product.offerPrice.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground line-through">
            ₹{(product.actualPrice || product.price || 0).toLocaleString()}
          </div>
          <div className="text-xs text-green-600 mt-1 font-medium">
            Save ₹{((product.actualPrice || product.price || 0) - product.offerPrice).toLocaleString()}
          </div>
        </div>
      ) : (
        <div className="text-xl sm:text-2xl font-bold text-primary mb-4">
          ₹{(product.actualPrice || product.price || 0).toLocaleString()}
        </div>
      )}

      {product.stock > 0 ? (
        <p className="text-xs text-green-600 mb-4 font-medium">In stock — {product.stock} available</p>
      ) : (
        <p className="text-xs text-destructive mb-4 font-medium">Out of stock</p>
      )}

      <div className="mb-4 rounded-lg border bg-muted/20 px-3 py-2.5">
        <h3 className="text-xs font-semibold mb-1 text-foreground/90">Description</h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{product.description}</p>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Quantity</span>
          <QuantitySelector
            quantity={quantity}
            maxQuantity={product.stock}
            onQuantityChange={onQuantityChange}
          />
        </div>
        <Button
          size="default"
          className="w-full rounded-lg h-10 text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
          onClick={onAddToCart}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="h-3.5 w-3.5 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
