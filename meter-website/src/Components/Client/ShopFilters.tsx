import React, { useState } from 'react';

const ShopFilters = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className=" md:hidden flex justify-between items-center mb-4 ">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm text-blue-600 underline"
        >
          {isOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Filters Panel */}
      <aside
        className={`md:w-1/4 w-full space-y-6 pr-4 transition-all duration-300 ease-in-out ${
          isOpen ? 'block' : 'hidden'
        } md:block`}
      ><div className='shadow-lg p-3   rounded-lg pl-4'>
        <h2 className="text-lg font-semibold hidden md:block">Filters</h2>

        {/* Category */}
        <div>
          <h4 className="font-medium mb-2">Category</h4>
          <ul className="space-y-1">
            <li><label className='text-sm'><input type="checkbox" className="mr-2" /> Speedometers</label></li>
            <li><label className='text-sm'><input type="checkbox" className="mr-2" /> Display Boards</label></li>
            <li><label className='text-sm'><input type="checkbox" className="mr-2" /> Sensors</label></li>
          </ul>
        </div>

        {/* Availability */}
        <div>
          <h4 className="font-medium mb-2">Availability</h4>
          <ul className="space-y-1">
            <li><label className='text-sm'><input type="checkbox" className="mr-2" /> In Stock</label></li>
            <li><label className='text-sm'><input type="checkbox" className="mr-2" /> Out of Stock</label></li>
          </ul>
        </div>
        </div>
      </aside>
    </>
  );
};

export default ShopFilters;
