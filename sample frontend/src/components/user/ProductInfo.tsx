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
    <div className="px-0 sm:px-2">
      <Badge variant="secondary" className="mb-3 rounded-lg">{product.category}</Badge>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4">{product.name}</h1>

      {product.offerPrice && product.offerPrice > 0 && product.actualPrice ? (
        <div className="mb-6">
          <div className="text-2xl sm:text-3xl font-bold text-primary">₹{product.offerPrice.toLocaleString()}</div>
          <div className="text-lg text-muted-foreground line-through">₹{(product.actualPrice || product.price || 0).toLocaleString()}</div>
          <div className="text-sm text-green-600 mt-1">Save ₹{((product.actualPrice || product.price || 0) - product.offerPrice).toLocaleString()}</div>
        </div>
      ) : (
        <div className="text-2xl sm:text-3xl font-bold text-primary mb-6">
          ₹{(product.actualPrice || product.price || 0).toLocaleString()}
        </div>
      )}

      {product.stock > 0 ? (
        <p className="text-sm text-green-600 mb-6">In stock — {product.stock} available</p>
      ) : (
        <p className="text-sm text-destructive mb-6">Out of stock</p>
      )}

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Description</h3>
        <p className="text-muted-foreground leading-relaxed">{product.description}</p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <span className="font-medium whitespace-nowrap">Quantity</span>
          <QuantitySelector
            quantity={quantity}
            maxQuantity={product.stock}
            onQuantityChange={onQuantityChange}
          />
        </div>
        <Button
          size="lg"
          className="w-full rounded-xl font-semibold shadow-sm hover:shadow transition-all"
          onClick={onAddToCart}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
