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
      <Badge variant="secondary" className="mb-3 sm:mb-4 text-xs sm:text-sm">{product.category}</Badge>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">{product.name}</h1>
      
      {product.offerPrice && product.offerPrice > 0 && product.actualPrice ? (
        <div className="mb-4 sm:mb-6">
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
            ₹{product.offerPrice.toLocaleString()}
          </div>
          <div className="text-lg sm:text-xl text-muted-foreground line-through">
            ₹{(product.actualPrice || product.price || 0).toLocaleString()}
          </div>
          <div className="text-sm sm:text-base text-green-600 mt-1">
            Save ₹{((product.actualPrice || product.price || 0) - product.offerPrice).toLocaleString()}
          </div>
        </div>
      ) : (
        <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4 sm:mb-6">
          ₹{(product.actualPrice || product.price || 0).toLocaleString()}
        </div>
      )}

      {product.stock > 0 ? (
        <p className="text-sm sm:text-base text-green-600 mb-4 sm:mb-6">In Stock ({product.stock} available)</p>
      ) : (
        <p className="text-sm sm:text-base text-destructive mb-4 sm:mb-6">Out of Stock</p>
      )}

      <div className="mb-4 sm:mb-6">
        <h3 className="font-semibold mb-2 text-sm sm:text-base">Description</h3>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{product.description}</p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <label className="font-semibold text-sm sm:text-base whitespace-nowrap">Quantity:</label>
          <QuantitySelector
            quantity={quantity}
            maxQuantity={product.stock}
            onQuantityChange={onQuantityChange}
          />
        </div>

        <Button 
          size="lg" 
          className="w-full text-sm sm:text-base"
          onClick={onAddToCart}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
