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
      <div className="bg-card border rounded-2xl p-4 sm:p-5 md:p-6 mb-6 sm:mb-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="relative sm:col-span-2 md:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-11 rounded-xl border-border/80"
            />
          </div>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="h-11 rounded-xl text-sm sm:text-base">
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
            <SelectTrigger className="h-11 rounded-xl text-sm sm:text-base">
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

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-5 sm:mb-6">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{productCount}</span> product{productCount !== 1 ? 's' : ''}
        </p>
        {selectedCategory !== 'all' && (
          <Badge
            variant="secondary"
            className="rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors"
            onClick={() => onCategoryChange('all')}
          >
            {selectedCategory} ×
          </Badge>
        )}
      </div>
    </>
  );
}
