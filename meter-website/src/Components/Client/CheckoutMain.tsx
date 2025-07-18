import React, { useState } from 'react';
import CouponBox from './CouponBox';

const CheckoutMain = () => {
  const [billingSame, setBillingSame] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
      {/* Left: Customer Input Sections */}
      <div className="md:col-span-2 space-y-6">
        {/* Contact Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Full Name" className="input" />
            <input type="email" placeholder="Email" className="input" />
            <input type="tel" placeholder="Phone Number" className="input md:col-span-2" />
          </div>
          <div className="mt-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={newsletter} onChange={() => setNewsletter(!newsletter)} />
              Subscribe to newsletter
            </label>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Address Line 1" className="input md:col-span-2" />
            <input type="text" placeholder="Address Line 2" className="input md:col-span-2" />
            <input type="text" placeholder="City" className="input" />
            <input type="text" placeholder="State/Province" className="input" />
            <input type="text" placeholder="Postal Code" className="input" />
            <select className="input">
              <option>India</option>
              <option>USA</option>
              <option>UK</option>
            </select>
          </div>
          <div className="mt-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={billingSame} onChange={() => setBillingSame(!billingSame)} />
              Billing address same as shipping
            </label>
          </div>
        </div>

        {/* Shipping Method */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Shipping Method</h2>
          <label className="block mb-2">
            <input type="radio" name="shipping" className="mr-2" defaultChecked />
            Standard (3–5 days – Free)
          </label>
          <label className="block mb-2">
            <input type="radio" name="shipping" className="mr-2" />
            Express (1–2 days – ₹100)
          </label>
        </div>

        {/* Payment Method */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
          <input type="text" placeholder="Card Number" className="input mb-2" />
          <div className="grid grid-cols-2 gap-2">
            <input type="text" placeholder="MM/YY" className="input" />
            <input type="text" placeholder="CVV" className="input" />
          </div>
          <div className="mt-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" /> Save payment information
            </label>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Delivery Instructions</h2>
          <textarea rows={4} placeholder="Leave instructions for delivery..." className="input w-full"></textarea>
        </div>
      </div>

      {/* Right: Order Summary */}
      <div className="bg-white p-6 rounded-lg shadow space-y-6 h-fit sticky top-20">
        <h2 className="text-lg font-semibold border-b border-gray-300 pb-2">Order Summary</h2>

        {/* Product List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Digital Meter Cluster</p>
              <p className="text-xs text-gray-500">Qty: 1</p>
            </div>
            <p className="font-semibold">₹2,999</p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Sensor Wire Kit</p>
              <p className="text-xs text-gray-500">Qty: 1</p>
            </div>
            <p className="font-semibold">₹699</p>
          </div>
        </div>

        <div className="border-t border-gray-300 pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹3,698</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>₹100</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>₹3,798</span>
          </div>
        </div>

        <CouponBox />

        <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 mt-4">
          💳 Place Order
        </button>
        <p className="text-xs text-gray-500 text-center mt-2">You’ll be redirected to a secure payment gateway.</p>
      </div>
    </div>
  );
};

export default CheckoutMain;
