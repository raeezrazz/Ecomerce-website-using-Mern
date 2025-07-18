import React from "react";
import { Truck, RotateCcw, ShieldCheck, Clock } from "lucide-react";

const DeliveryPolicy = () => {
  return (
    <>
    <hr className="my-2 border-gray-300" />

    <div className="mt-6  pt-6 grid md:grid-cols-2 gap-6 text-gray-700 text-sm shadow-lg p-3">
      {/* Estimated Delivery */}
      <div className="flex items-start gap-3">
        <Clock className="text-blue-600 w-6 h-6 mt-1" />
        <div>
          <h4 className="font-semibold text-gray-800">Estimated Delivery</h4>
          <p>Within 4–7 working days across India.</p>
        </div>
      </div>

      {/* Free Shipping */}
      <div className="flex items-start gap-3">
        <Truck className="text-blue-600 w-6 h-6 mt-1" />
        <div>
          <h4 className="font-semibold text-gray-800">Free Shipping</h4>
          <p>Available on orders above ₹999. Trackable doorstep delivery.</p>
        </div>
      </div>

      {/* Return Policy */}
      <div className="flex items-start gap-3">
        <RotateCcw className="text-blue-600 w-6 h-6 mt-1" />
        <div>
          <h4 className="font-semibold text-gray-800">Return Policy</h4>
          <p>7-day return window for unused and undamaged products.</p>
        </div>
      </div>

      {/* Warranty Info */}
      <div className="flex items-start gap-3">
        <ShieldCheck className="text-blue-600 w-6 h-6 mt-1" />
        <div>
          <h4 className="font-semibold text-gray-800">Warranty</h4>
          <p>6-month warranty for display and board-related repairs.</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default DeliveryPolicy;
