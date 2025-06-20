import React from "react";
import { Star, Heart, ShoppingCart, Zap } from "lucide-react";

const ProductDetails = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Left: Product Images */}
      <div className="space-y-4">
        <div className="relative">
          <img
            src="/sample-meter.jpg"
            alt="Product"
            className="w-full h-[400px] object-contain rounded-xl border"
          />
          {/* Optional zoom effect on hover */}
        </div>
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <img
              key={i}
              src={`/sample-meter-${i}.jpg`}
              alt={`Thumb ${i}`}
              className="w-20 h-20 object-contain rounded-lg border cursor-pointer hover:ring-2 hover:ring-blue-400"
            />
          ))}
        </div>
      </div>

      {/* Right: Product Info */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Digital Speedometer - Honda Activa</h1>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex text-yellow-400">
            {[...Array(4)].map((_, i) => (
              <Star key={i} size={18} fill="currentColor" />
            ))}
            <Star size={18} className="text-gray-300" />
          </div>
          <p className="text-sm text-gray-500">(56 reviews)</p>
        </div>

        {/* Price */}
        <div className="text-xl font-bold text-blue-600">₹1,499</div>
        <p className="text-sm text-gray-500 line-through">₹1,999</p>
        <p className="text-sm text-green-600 font-semibold">25% OFF</p>

        {/* Description */}
        <p className="text-gray-700">
          High-precision digital meter compatible with Honda Activa models. Includes display, wiring, and backlight replacement. 6-month warranty included.
        </p>

        {/* Options */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-600">Color:</span>
            <button className="w-6 h-6 bg-black rounded-full border-2 border-gray-300" />
            <button className="w-6 h-6 bg-gray-600 rounded-full border-2 border-gray-300" />
          </div>

          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-600">Size:</span>
            <select className="border px-3 py-1 rounded-md">
              <option>Standard</option>
              <option>Small</option>
              <option>Large</option>
            </select>
          </div>

          {/* Stock Status */}
          <p className="text-green-600 text-sm font-medium">✅ In Stock - Ready to ship</p>

          {/* Quantity */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-600">Quantity:</span>
            <input
              type="number"
              min="1"
              defaultValue="1"
              className="w-16 px-2 py-1 border rounded-md text-center"
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 mt-4">
            <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow">
              <ShoppingCart size={18} /> Add to Cart
            </button>
            <button className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow">
              <Zap size={18} /> Buy Now
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border text-gray-600 rounded-lg hover:bg-gray-100">
              <Heart size={18} /> Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
