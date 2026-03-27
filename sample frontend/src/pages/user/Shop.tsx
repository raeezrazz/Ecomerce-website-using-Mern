import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '@/api/adminApi';
import type { Product, Category } from '@/types';
import { ShopFilters } from '@/components/user/ShopFilters';
import { ProductGrid } from '@/components/user/ProductGrid';
import { useToast } from '@/hooks/use-toast';

export default function Shop() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'all');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch {
        toast({
          title: 'Error',
          description: 'Failed to load products. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [toast]);

  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (selectedCategory !== 'all') filtered = filtered.filter((p) => p.category === selectedCategory);
    if (searchQuery) filtered = filtered.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const sorted = [...filtered].sort((a, b) => {
      const priceA = a.offerPrice && a.offerPrice > 0 ? a.offerPrice : (a.actualPrice || a.price || 0);
      const priceB = b.offerPrice && b.offerPrice > 0 ? b.offerPrice : (b.actualPrice || b.price || 0);
      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      return a.name.localeCompare(b.name);
    });
    return sorted;
  }, [selectedCategory, searchQuery, sortBy, products]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSearchParams(value !== 'all' ? { category: value } : {});
  };

  if (loading) {
    return (
      <div className="user-page-dots min-h-[50vh]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="h-7 w-48 rounded-lg bg-muted animate-pulse mb-5" />
          <div className="rounded-xl border bg-card/80 p-4 mb-5 h-20 bg-muted/30 animate-pulse backdrop-blur-sm" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="rounded-xl border bg-card overflow-hidden shadow-sm">
                <div className="aspect-square bg-muted animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                  <div className="h-5 w-20 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-page-dots min-h-[50vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <header className="mb-5 sm:mb-6">
          <h1 className="font-display text-xl sm:text-2xl font-semibold tracking-tight animate-fade-in-up">
            Shop
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 animate-fade-in-up animate-delay-100 animate-fill-both">
            Find the right parts for your vehicle
          </p>
        </header>

      <ShopFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        sortBy={sortBy}
        onSortChange={setSortBy}
        productCount={filteredProducts.length}
        categories={categories}
      />

      <ProductGrid products={filteredProducts} />
      </div>
    </div>
  );
}
