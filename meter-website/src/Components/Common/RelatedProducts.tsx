import React from "react";
import { Star } from "lucide-react";

const relatedItems = [
  {
    id: 1,
    name: "Hero Splendor Digital Meter",
    image: "/images/products/meter1.jpg",
    price: 1299,
    rating: 4.5,
    badge: "New",
  },
  {
    id: 2,
    name: "Pulsar LED Cluster Board",
    image: "/images/products/meter2.jpg",
    price: 2399,
    rating: 4,
    badge: "Hot",
  },
  {
    id: 3,
    name: "TVS Apache RPM Meter",
    image: "/images/products/meter3.jpg",
    price: 1799,
    rating: 4.2,
    badge: "Sale",
  },
  {
    id: 4,
    name: "Activa Analog Meter with Fuel Indicator",
    image: "/images/products/meter4.jpg",
    price: 999,
    rating: 3.9,
  },
];

const RelatedProducts = () => {
  return (
    <div className="mt-12">
      <h3 className="text-xl font-semibold mb-4">You May Also Like</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-x-auto scrollbar-hide">
        {relatedItems.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-300 rounded-xl shadow hover:shadow-md transition-all"
          >
            <div className="relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 object-cover rounded-t-xl"
              />
              {item.badge && (
                <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                  {item.badge}
                </span>
              )}
            </div>
            <div className="p-3">
              <h4 className="text-sm font-medium mb-1">{item.name}</h4>
              <div className="flex items-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(item.rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill={
                      i < Math.round(item.rating) ? "currentColor" : "none"
                    }
                  />
                ))}
              </div>
              <p className="text-sm font-semibold text-blue-700">₹{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
