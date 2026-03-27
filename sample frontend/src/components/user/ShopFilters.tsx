import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import type { Category } from '@/types';

interface ShopFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  productCount: number;
  categories?: Category[];
}

export function ShopFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  productCount,
  categories = [],
}: ShopFiltersProps) {
  return (
    <>
      <div className="bg-card/90 backdrop-blur-sm border rounded-xl p-3 sm:p-4 mb-4 shadow-soft transition-shadow hover:shadow-soft-lg motion-safe:animate-fade-in-up motion-safe:animate-delay-100 motion-safe:animate-fill-both">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          <div className="relative sm:col-span-2 md:col-span-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 h-9 rounded-lg border-border/80 text-sm"
            />
          </div>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="h-9 rounded-lg text-xs sm:text-sm">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="h-9 rounded-lg text-xs sm:text-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="price-low">Price (Low to High)</SelectItem>
              <SelectItem value="price-high">Price (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 motion-safe:animate-fade-in motion-safe:animate-delay-200 motion-safe:animate-fill-both">
        <p className="text-xs text-muted-foreground">
          Showing <span className="font-medium text-foreground">{productCount}</span> product{productCount !== 1 ? 's' : ''}
        </p>
        {selectedCategory !== 'all' && (
          <Badge
            variant="secondary"
            className="rounded-md text-xs cursor-pointer hover:bg-secondary/80 transition-all active:scale-95"
            onClick={() => onCategoryChange('all')}
          >
            {selectedCategory} ×
          </Badge>
        )}
      </div>
    </>
  );
}
