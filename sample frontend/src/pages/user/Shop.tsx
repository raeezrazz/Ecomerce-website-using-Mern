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
          fetchCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
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
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low': {
          const actualPriceA = a.actualPrice || a.price || 0;
          const actualPriceB = b.actualPrice || b.price || 0;
          const priceA = a.offerPrice && a.offerPrice > 0 ? a.offerPrice : actualPriceA;
          const priceB = b.offerPrice && b.offerPrice > 0 ? b.offerPrice : actualPriceB;
          return priceA - priceB;
        }
        case 'price-high': {
          const actualPriceA = a.actualPrice || a.price || 0;
          const actualPriceB = b.actualPrice || b.price || 0;
          const priceA = a.offerPrice && a.offerPrice > 0 ? a.offerPrice : actualPriceA;
          const priceB = b.offerPrice && b.offerPrice > 0 ? b.offerPrice : actualPriceB;
          return priceB - priceA;
        }
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return sorted;
  }, [selectedCategory, searchQuery, sortBy, products]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    if (value !== 'all') {
      setSearchParams({ category: value });
    } else {
      setSearchParams({});
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 w-full">
        <div className="text-center py-8 sm:py-12">
          <p className="text-sm sm:text-base text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 w-full">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8">Shop Products</h1>

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
