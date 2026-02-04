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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="h-10 w-64 rounded-xl bg-muted animate-pulse mb-8" />
        <div className="rounded-2xl border bg-card p-6 mb-8 h-24 bg-muted/30 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="rounded-2xl border bg-card overflow-hidden">
              <div className="aspect-square bg-muted animate-pulse" />
              <div className="p-5 space-y-2">
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                <div className="h-5 w-full bg-muted rounded animate-pulse" />
                <div className="h-6 w-24 bg-muted rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2 animate-fade-in-up">Shop</h1>
      <p className="text-muted-foreground mb-6 sm:mb-8 animate-fade-in-up animate-delay-100 animate-fill-both opacity-0">
        Find the right parts for your vehicle
      </p>

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
  );
}
