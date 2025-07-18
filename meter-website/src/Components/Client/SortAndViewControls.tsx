import React, { useState } from 'react';
import { List, LayoutGrid } from 'lucide-react';

const SortAndViewControls = () => {
  const [sortBy, setSortBy] = useState('newest');
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

  return (
    <div className="flex items-center justify-between mb-6">
      {/* Sort Dropdown */}
      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm font-medium">Sort by:</label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="shadow-sm  rounded px-3 py-1 text-sm"
        >
          <option value="newest">New Arrivals</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {/* View Toggle */}
      {/* <div className="flex items-center gap-2">
        <button
          onClick={() => setViewType('grid')}
          className={`p-2 rounded ${viewType === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          <LayoutGrid className="w-4 h-4" />
        </button>
        <button
          onClick={() => setViewType('list')}
          className={`p-2 rounded ${viewType === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          <List className="w-4 h-4" />
        </button>
      </div> */}
    </div>
  );
};

export default SortAndViewControls;
