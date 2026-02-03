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
      <div className="bg-card border rounded-lg p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="relative sm:col-span-2 md:col-span-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 text-sm sm:text-base"
            />
          </div>

          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="text-sm sm:text-base">
              <SelectValue placeholder="Select category" />
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
            <SelectTrigger className="text-sm sm:text-base">
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

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
        <p className="text-sm sm:text-base text-muted-foreground">
          Showing {productCount} product{productCount !== 1 ? 's' : ''}
        </p>
        {selectedCategory !== 'all' && (
          <Badge variant="secondary" className="cursor-pointer text-xs sm:text-sm" onClick={() => onCategoryChange('all')}>
            {selectedCategory} ✕
          </Badge>
        )}
      </div>
    </>
  );
}
