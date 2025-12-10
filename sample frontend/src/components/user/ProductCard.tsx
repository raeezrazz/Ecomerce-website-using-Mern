import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden group">
        <div className="aspect-square overflow-hidden bg-muted">
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-3 sm:p-4">
          <Badge variant="secondary" className="mb-2 text-xs sm:text-sm">{product.category}</Badge>
          <h3 className="font-semibold text-base sm:text-lg mb-1 line-clamp-2">{product.name}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-2">SKU: {product.sku}</p>
          <p className="text-xl sm:text-2xl font-bold text-primary">₹{product.price.toLocaleString()}</p>
          {product.stock < 10 && product.stock > 0 && (
            <p className="text-xs sm:text-sm text-orange-600 mt-1">Only {product.stock} left!</p>
          )}
          {product.stock === 0 && (
            <p className="text-xs sm:text-sm text-destructive mt-1">Out of stock</p>
          )}
        </CardContent>
        <CardFooter className="p-3 sm:p-4 pt-0">
          <Button 
            className="w-full text-xs sm:text-sm" 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            size="sm"
          >
            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
