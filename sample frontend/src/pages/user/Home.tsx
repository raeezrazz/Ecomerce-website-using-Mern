import { useEffect, useState } from 'react';
import { fetchProducts } from '@/api/adminApi';
import type { Product } from '@/types';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { FeaturedProductsSection } from '@/components/home/FeaturedProductsSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await fetchProducts();
        setFeaturedProducts(products.slice(0, 8));
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    };
    loadProducts();
  }, []);

  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProductsSection products={featuredProducts} />
      <FeaturesSection />
    </div>
  );
}
