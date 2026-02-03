import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/user/ProductCard';
import { ArrowRight } from 'lucide-react';
import type { Product } from '@/types';

interface FeaturedProductsSectionProps {
  products: Product[];
}

export function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
  return (
    <section className="bg-muted py-8 sm:py-12 md:py-16 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 md:mb-12">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-8 sm:mt-10 md:mt-12">
          <Link to="/shop">
            <Button size="lg" className="text-sm sm:text-base">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
