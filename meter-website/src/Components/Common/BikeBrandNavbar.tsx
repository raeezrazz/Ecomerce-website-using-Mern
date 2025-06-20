import React, { useState } from 'react';

function BikeBrandNavbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const brands = [
    {
      name: 'Honda',
      models: ['Shine', 'SP 125', 'Unicorn', 'Hornet'],
    },
    {
      name: 'Hero',
      models: ['Splendor', 'Glamour', 'Xpulse 200', 'HF Deluxe'],
    },
    {
      name: 'Bajaj',
      models: ['Pulsar 150', 'CT 100', 'Avenger', 'Dominar 400'],
    },
    {
      name: 'TVS',
      models: ['Apache RTR', 'Raider', 'Jupiter', 'NTorq'],
    },
    {
      name: 'Yamaha',
      models: ['R15 V4', 'FZ-S', 'MT-15', 'Fascino'],
    },
    {
      name: 'Royal Enfield',
      models: ['Classic 350', 'Meteor 350', 'Bullet 350', 'Himalayan'],
    },
    // Add more if needed
  ];

  return (
    <nav className="relative  bg-blue  shadow-xl bg-blue-500">
      <div className="flex space-x-6 min-w-max  ml-[15%]">
        {brands.map((brand) => (
          <div className="relative group" key={brand.name}>
            <button
              onClick={() => toggleMenu(brand.name)}
              className="text-xs hover:underline transition text-white"
            >
              {brand.name}
            </button>

            {openMenu === brand.name && (
              <div className="absolute top-full left-0 mt-1 w-40 bg-white text-blue-900  rounded shadow-xl text-sm ">
                {brand.models.map((model) => (
                  <a
                    key={model}
                    href="#"
                    className="block px-4 py-2 hover:bg-blue-200"
                  >
                    {model}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}

export default BikeBrandNavbar;
