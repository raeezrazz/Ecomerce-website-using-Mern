import React from 'react'

const ShopFilters = () => {
  return (
    <aside className="md:w-1/4 w-full space-y-6 border-r pr-4">
      <h2 className="text-lg font-semibold">Filters</h2>

      {/* Category */}
      <div>
        <h4 className="font-medium mb-2">Category</h4>
        <ul className="space-y-1">
          <li><input type="checkbox" /> Speedometers</li>
          <li><input type="checkbox" /> Display Boards</li>
          <li><input type="checkbox" /> Sensors</li>
        </ul>
      </div>

      {/* Availability */}
      <div>
        <h4 className="font-medium mb-2">Availability</h4>
        <ul className="space-y-1">
          <li><input type="checkbox" /> In Stock</li>
          <li><input type="checkbox" /> Out of Stock</li>
        </ul>
      </div>
    </aside>
  );
};

export default ShopFilters;
