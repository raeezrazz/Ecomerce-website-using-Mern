import React, { useState } from "react";
import { Trash2 } from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  brand?: string;
  price: number;
  quantity: number;
  stock: number;
  image: string;
}

const initialItems: CartItem[] = [
  {
    id: 1,
    name: "Speedometer Display Unit",
    brand: "MeterPro",
    price: 1200,
    quantity: 1,
    stock: 3,
    image: "/images/speedo.jpg",
  },
  {
    id: 2,
    name: "Digital Fuel Gauge",
    brand: "AutoMeter",
    price: 750,
    quantity: 2,
    stock: 0,
    image: "/images/fuel.jpg",
  },
];

const CartMain = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialItems);
  const [discount, setDiscount] = useState<number>(0);

  const updateQuantity = (id: number, change: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + change),
            }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 2000 ? 0 : 150;
  const total = subtotal - discount + shipping;

  return (
    <div className="flex flex-col md:flex-row gap-8 px-4 py-6 md:px-8 bg-white">
      {/* Left: Cart Items */}
      <div className="flex-1">
        <h2 className="text-lg font-semibold mb-4">Items in your cart</h2>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 border border-gray-300 p-4 rounded-lg shadow-sm"
            >
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" />

              <div className="flex-1">
                <h3 className="text-md font-bold">{item.name}</h3>
                {item.brand && <p className="text-sm text-gray-500">{item.brand}</p>}
                <p className="text-sm text-gray-700">₹{item.price} / unit</p>

                {item.stock === 0 ? (
                  <p className="text-sm text-red-600 mt-1">⚠️ Out of Stock</p>
                ) : (
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="px-2 bg-gray-200 rounded"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="px-2 bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>

              <div className="text-right">
                <p className="font-semibold">₹{item.price * item.quantity}</p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 mt-2 hover:text-red-700"
                  title="Remove"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Summary */}
      <div className="w-full md:w-1/3 border border-gray-300 p-6 rounded-lg shadow-sm bg-gray-50">
        <h3 className="text-lg font-bold mb-4">Order Summary</h3>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span>₹{discount}</span>
          </div>
          <div className="border-t border-gray-300 pt-3 flex justify-between font-semibold text-gray-900">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>

        {/* Discount Code */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Promo Code"
            className="w-full p-2 border border-gray-300 rounded mb-2"
            onChange={(e) => setDiscount(e.target.value === "METER10" ? 100 : 0)}
          />
          <p className="text-xs text-gray-500">Use code <b>METER10</b> for ₹100 off</p>
        </div>

        <button className="mt-4 w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition">
          💳 Proceed to Checkout
        </button>

        <button className="mt-2 w-full text-sm text-blue-600 hover:underline">
          ← Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default CartMain;
