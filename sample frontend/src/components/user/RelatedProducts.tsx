import { ProductCard } from '@/components/user/ProductCard';
import type { Product } from '@/types';

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="border-t border-border/60 pt-8">
      <h2 className="font-display text-sm sm:text-base font-semibold mb-4 motion-safe:animate-fade-in-up">
        Related products
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-3.5">
        {products.map((p, i) => (
          <div
            key={p.id}
            className="opacity-0 motion-safe:animate-fade-in-up animate-fill-both"
            style={{ animationDelay: `${120 + i * 40}ms` }}
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
