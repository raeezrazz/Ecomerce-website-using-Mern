import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

const imgPlaceholder =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect fill="%23f4f4f5" width="200" height="200"/%3E%3Ctext fill="%23a1a1aa" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="12"%3ENo image%3C/text%3E%3C/svg%3E';

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

  const thumb = product.images?.[0] ?? imgPlaceholder;

  return (
    <Link to={`/product/${product.id}`} className="group block h-full">
      <Card
        className={[
          'h-full overflow-hidden flex flex-col',
          'rounded-2xl',
          'border border-border/90',
          'bg-card',
          'ring-1 ring-black/[0.035] dark:ring-white/[0.08]',
          'shadow-[0_1px_2px_rgba(15,23,42,0.04),0_4px_16px_-4px_rgba(15,23,42,0.08),0_12px_32px_-12px_rgba(15,23,42,0.06)]',
          'dark:shadow-[0_1px_2px_rgba(0,0,0,0.2),0_8px_28px_-8px_rgba(0,0,0,0.45)]',
          'transition-all duration-300 ease-out',
          'hover:-translate-y-1 hover:border-primary/35',
          'hover:ring-primary/15',
          'hover:shadow-[0_4px_12px_-2px_rgba(15,23,42,0.06),0_16px_40px_-12px_hsl(var(--primary)/0.14),0_24px_56px_-16px_rgba(15,23,42,0.08)]',
          'dark:hover:shadow-[0_8px_28px_-6px_rgba(0,0,0,0.5),0_0_0_1px_hsl(var(--primary)/0.2)]',
        ].join(' ')}
      >
        <div className="aspect-square overflow-hidden bg-gradient-to-b from-muted/50 to-muted relative isolate">
          <div className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />
          <img
            src={thumb}
            alt={product.name}
            className="relative z-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
          />
          {hasOffer && (
            <span className="absolute top-2 right-2 z-20 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground shadow-md shadow-primary/25 backdrop-blur-[2px]">
              Sale
            </span>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/65 backdrop-blur-[2px]">
              <span className="rounded-md bg-destructive/90 px-2 py-1 text-[10px] font-semibold text-destructive-foreground shadow-sm">
                Sold out
              </span>
            </div>
          )}
        </div>

        <CardContent className="p-3.5 sm:p-4 flex flex-col flex-1 border-t border-border/50 bg-gradient-to-b from-card to-muted/15">
          <Badge
            variant="secondary"
            className="mb-2 w-fit rounded-lg border border-border/60 bg-secondary/80 px-2 py-0.5 text-[10px] font-medium shadow-sm"
          >
            {product.category}
          </Badge>
          <h3 className="font-medium text-xs sm:text-sm leading-snug mb-2 line-clamp-2 text-foreground/95 transition-colors group-hover:text-primary">
            {product.name}
          </h3>
          <div className="mt-auto">
            {hasOffer ? (
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-sm sm:text-base font-bold tabular-nums text-primary">
                  ₹{product.offerPrice!.toLocaleString()}
                </span>
                <span className="text-[11px] text-muted-foreground line-through tabular-nums">
                  ₹{(product.actualPrice || product.price || 0).toLocaleString()}
                </span>
              </div>
            ) : (
              <p className="text-sm sm:text-base font-bold tabular-nums text-primary">₹{price.toLocaleString()}</p>
            )}
            {product.stock < 10 && product.stock > 0 && (
              <p className="text-[10px] font-medium text-amber-600 dark:text-amber-500 mt-1">
                Only {product.stock} left
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-3.5 sm:p-4 pt-0 pb-3.5 sm:pb-4 border-t border-border/40 bg-muted/10">
          <Button
            className="w-full rounded-xl h-9 text-xs font-semibold shadow-sm shadow-black/5 dark:shadow-black/20 transition-all duration-200 hover:shadow-md hover:brightness-[1.02] active:scale-[0.98]"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            size="sm"
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
            Add to cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
