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
    <section className="w-full bg-muted/30 py-14 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 animate-fade-in-up">Featured Products</h2>
          <p className="text-muted-foreground max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: '80ms' }}>
            Handpicked quality parts for you
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 stagger-children">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-10 sm:mt-12 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <Link to="/shop">
            <Button size="lg" className="rounded-xl h-12 px-6 font-semibold shadow-sm hover:shadow transition-all duration-300 hover:-translate-y-0.5">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
