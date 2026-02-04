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

  const price = product.offerPrice && product.offerPrice > 0 ? product.offerPrice : (product.actualPrice || product.price || 0);
  const hasOffer = product.offerPrice && product.offerPrice > 0 && product.actualPrice;

  return (
    <Link to={`/product/${product.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:-translate-y-1 flex flex-col">
        <div className="aspect-square overflow-hidden bg-muted/50 relative">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <CardContent className="p-4 sm:p-5 flex flex-col flex-1">
          <Badge variant="secondary" className="mb-2 w-fit text-xs rounded-lg">
            {product.category}
          </Badge>
          <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="mt-auto">
            {hasOffer ? (
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-xl font-bold text-primary">₹{product.offerPrice!.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground line-through">₹{(product.actualPrice || product.price || 0).toLocaleString()}</span>
              </div>
            ) : (
              <p className="text-xl font-bold text-primary">₹{price.toLocaleString()}</p>
            )}
            {product.stock < 10 && product.stock > 0 && (
              <p className="text-xs text-orange-600 mt-1">Only {product.stock} left</p>
            )}
            {product.stock === 0 && (
              <p className="text-xs text-destructive mt-1">Out of stock</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 sm:p-5 pt-0">
          <Button
            className="w-full rounded-xl font-medium transition-all duration-300 hover:shadow-md"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            size="sm"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
