import React from 'react';
import { FaTachometerAlt } from 'react-icons/fa'; // Speedometer icon

const AboutSection = () => {
  return (
    <section className="bg-gray-50 py-16 px-4 md:px-12">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left content */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            About RS Meter Service
          </h2>
          <p className="text-gray-600 text-lg mb-6 leading-relaxed">
            RS Meter Service is your trusted partner for <strong>vehicle meter diagnostics, repair, and restoration</strong>.
            With years of hands-on experience, we specialize in fixing analog and digital speedometers, fuel gauges,
            display boards, and cluster systems.
          </p>
          <p className="text-gray-600 text-lg mb-6 leading-relaxed">
            We believe in accuracy, reliability, and customer satisfaction. Whether you're dealing with
            flickering displays, malfunctioning sensors, or dead pixels, we have the tools and expertise
            to restore your dashboard to perfect working condition.
          </p>
          <p className="text-gray-600 text-lg">
            Located in <strong>Kerala</strong>, we serve individual vehicle owners, auto garages, and service
            centers with honest, affordable solutions backed by quality workmanship.
          </p>
        </div>

        {/* Right icon/illustration */}
        <div className="flex justify-center md:justify-end">
          <div className="bg-blue-100 p-8 rounded-full shadow-lg">
            <FaTachometerAlt className="w-28 h-28 text-blue-600" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
