import React, { useState } from "react";

const tabs = [
  { label: "Description", key: "description" },
  { label: "Specifications", key: "specs" },
  { label: "Size Guide", key: "size" },
  { label: "Materials Used", key: "materials" },
  { label: "How to Use", key: "usage" },
];

const ProductDiscription = () => {
  const [activeTab, setActiveTab] = useState("description");

  const renderContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="mt-4 text-sm text-gray-700">
            Our digital and analog speedometers are precisely calibrated and reworked for accurate vehicle diagnostics.
            Ideal for bikes, cars, and commercial vehicles. Services include display repair, needle calibration,
            sensor syncing, and full housing restoration.
          </div>
        );
      case "specs":
        return (
          <ul className="mt-4 text-sm text-gray-700 list-disc pl-5">
            <li>Compatible with major brands: Hero, Honda, TVS, Suzuki, etc.</li>
            <li>Voltage: 12V – 14.5V operating range</li>
            <li>Display types: LCD / LED / Analog Needle</li>
            <li>Accuracy: ±2%</li>
            <li>Rework Warranty: 6 Months</li>
          </ul>
        );
      case "size":
        return (
          <div className="mt-4 text-sm text-gray-700">
            <p><strong>Motorcycle:</strong> Round (80mm – 100mm) / Rectangular cluster</p>
            <p><strong>Car:</strong> Integrated dashboard modules</p>
            <p><strong>Trucks/Commercial:</strong> Heavy-duty circular meters (110mm+)</p>
          </div>
        );
      case "materials":
        return (
          <ul className="mt-4 text-sm text-gray-700 list-disc pl-5">
            <li>OEM-grade flex cables & resistors</li>
            <li>Anti-glare display films</li>
            <li>Polycarbonate lens covers</li>
            <li>PCB board solder with lead-free alloy</li>
          </ul>
        );
      case "usage":
        return (
          <div className="mt-4 text-sm text-gray-700">
            After service, connect the meter to your vehicle as per standard wiring. Power on ignition to verify readings.
            If analog, ensure needle resets to zero. If digital, check segment/LED illumination and accuracy.
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-10">
      <div className="flex gap-4 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`pb-2 px-1 text-sm font-medium ${
              activeTab === tab.key
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-500"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {renderContent()}
    </div>
  );
};

export default ProductDiscription;
