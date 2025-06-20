import React from "react";
import { Mail, Phone, Clock, MapPin } from "lucide-react"; // Install lucide-react for icons

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-100 px-6 md:px-20 py-12">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Left side: Company info */}
        <div>
          <img
            src="/images/rs-meter-logo.png" // Replace with your logo
            alt="RS Meter Logo"
            className="h-10 mb-6"
          />
          <h2 className="text-3xl font-semibold text-blue-600">
            Ready to <span className="text-blue-900">Revamp</span> Your Vehicle Meters?
          </h2>
          <p className="text-gray-600 mt-4 leading-relaxed">
            We provide professional meter calibration, repair, and upgrade services for cars, bikes, and heavy vehicles. Ensure accuracy and reliability on every drive.
          </p>
          <button className="mt-6 bg-blue-900 text-white font-semibold px-6 py-2 rounded-full hover:bg-blue-800 transition-all duration-300">
            Book a Service
          </button>
        </div>

        {/* Right side: Contact details with small icons */}
        <div className="flex flex-col gap-6 text-sm text-gray-800">
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <p className="text-blue-600 font-medium">Phone</p>
              <p>+91 97785 99696</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <p className="text-blue-600 font-medium">Email</p>
              <p>rsmeter.service@gmail.com</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <p className="text-blue-600 font-small">Working Hours</p>
              <p>Mon–Sat: 9:00am – 6:30pm</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <p className="text-blue-600 font-small">Location</p>
              <p>Ramanattukara, Calicut, Kerala</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
