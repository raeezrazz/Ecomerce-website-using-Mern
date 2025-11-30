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
    <div>
      <Badge variant="secondary" className="mb-4">{product.category}</Badge>
      <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
      <p className="text-sm text-muted-foreground mb-6">SKU: {product.sku}</p>
      
      <div className="text-4xl font-bold text-primary mb-6">
        ₹{product.price.toLocaleString()}
      </div>

      {product.stock > 0 ? (
        <p className="text-green-600 mb-6">In Stock ({product.stock} available)</p>
      ) : (
        <p className="text-destructive mb-6">Out of Stock</p>
      )}

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Description</h3>
        <p className="text-muted-foreground">{product.description}</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <label className="font-semibold">Quantity:</label>
          <QuantitySelector
            quantity={quantity}
            maxQuantity={product.stock}
            onQuantityChange={onQuantityChange}
          />
        </div>

        <Button 
          size="lg" 
          className="w-full"
          onClick={onAddToCart}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
