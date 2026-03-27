import { ProductCard } from '@/components/user/ProductCard';
import type { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 rounded-xl border border-dashed bg-muted/25 motion-safe:animate-scale-in">
        <p className="text-sm text-muted-foreground">No products match your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-3.5">
      {products.map((product, i) => (
        <div
          key={product.id}
          className="opacity-0 motion-safe:animate-fade-in-up motion-safe:animate-fill-both"
          style={{ animationDelay: `${Math.min(i, 20) * 35}ms` }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
