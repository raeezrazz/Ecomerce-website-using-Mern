import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchInput } from '@/components/shared/SearchInput';
import type { Category } from '@/types';

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  categories?: Category[];
}

export function ProductFilters({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  categories = [],
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-4 mb-6 sm:flex-row">
      <SearchInput
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search by product name..."
      />
      <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
        <SelectTrigger className="w-full sm:w-52">
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
    </div>
  );
}
