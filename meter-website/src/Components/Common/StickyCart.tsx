import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";

const StickyCartSummary = ({ title, price, onAddToCart }: {
  title: string;
  price: number;
  onAddToCart: () => void;
}) => {
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      // Show after 300px scroll (adjust as needed)
      setShowSticky(scrollTop > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!showSticky) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 px-4 py-3 flex items-center justify-between md:hidden">
      <div>
        <h5 className="text-sm font-medium line-clamp-1">{title}</h5>
        <p className="text-blue-600 font-semibold">₹{price}</p>
      </div>
      <button
        onClick={onAddToCart}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
      >
        <ShoppingCart className="w-4 h-4" />
        Add to Cart
      </button>
    </div>
  );
};

export default StickyCartSummary;
