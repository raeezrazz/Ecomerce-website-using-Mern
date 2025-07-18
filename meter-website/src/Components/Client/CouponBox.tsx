import React, { useState } from 'react';

const CouponBox = () => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleApply = () => {
    if (code.toLowerCase() === 'meter10') {
      setMessage({ type: 'success', text: '🎉 Coupon applied! ₹100 discount added.' });
    } else {
      setMessage({ type: 'error', text: '❌ Invalid coupon code. Try again.' });
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded-lg bg-white shadow mt-6">
      <h3 className="text-lg font-semibold mb-2">Have a promo code?</h3>
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Enter coupon code"
          className="w-full px-3 py-2 border border-gray-300 rounded"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Apply
        </button>
      </div>
      {message && (
        <p
          className={`mt-2 text-sm ${
            message.type === 'success' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
};

export default CouponBox;
