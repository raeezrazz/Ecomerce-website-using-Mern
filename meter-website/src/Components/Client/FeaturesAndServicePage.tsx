import React from "react";
import {
  Gauge,
  Wrench,
  RotateCcw,
  Zap,
  ShieldCheck,
  Search
} from "lucide-react"; // npm install lucide-react

const features = [
    {
      icon: <Gauge className="w-8 h-8 text-blue-600" />,
      title: "Digital & Analog Meter Repair",
      description:
        "We fix all types of speedometers, tachometers, and fuel meters — ensuring accuracy and proper functionality.",
    },
    {
      icon: <Zap className="w-8 h-8 text-blue-600" />,
      title: "Cluster Board Rework",
      description:
        "Complete cluster board rewiring and replacement of dead pixels, LED backlights, and power issues.",
    },
    {
      icon: <Wrench className="w-8 h-8 text-blue-600" />,
      title: "Sensor & Cable Replacement",
      description:
        "Fix or replace faulty sensor wires and speedometer cables with precision-grade components.",
    },
    {
      icon: <Search className="w-8 h-8 text-blue-600" />,
      title: "Full Diagnostic Testing",
      description:
        "We offer full vehicle cluster diagnostics using modern tools to detect and fix issues fast.",
    },
    {
      icon: <Gauge className="w-8 h-8 text-blue-600" />,
      title: "Display & Pixel Repairs",
      description:
        "We repair blurry or fading meter displays, stuck pixels, and screen brightness issues.",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
      title: "Warranty on Selected Services",
      description:
        "Select services such as display work and cluster rework are backed by a one-year warranty.",
    },
  ];

const FeaturesAndServices: React.FC = () => {
  return (
    <section className="bg-blue-200 py-16 px-6 md:px-20 rounded-lg  m-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-blue-600">
          Our <span className="text-blue-700">Services</span>
        </h2>
        <p className="mt-4 text-gray-600 max-w-xl mx-auto">
          Expert meter diagnostics, repair, and upgrades — trusted by two-wheeler and four-wheeler owners across Karnataka.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {features.map((feature, index) => (
          <div
            key={index}
            className="border bg-gray-200 border-blue-100 p-6 rounded-xl shadow-sm hover:shadow-lg  transition duration-300"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-lg font-semibold text-blue-800">{feature.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesAndServices;
