const Hero = () => {
    return (
      <section className="bg-gray-100 py-16 px-4 sm:px-8 lg:px-24 flex flex-col lg:flex-row items-center justify-between">
        {/* Text content */}
        <div className="text-center lg:text-left max-w-xl">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
            Welcome to <span className="text-blue-600">RK Meters</span>
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Premium automotive meter services with precision and style. We ensure your ride stays accurate and stylish.
          </p>
          <div className="flex justify-center lg:justify-start space-x-4">
            <a
              href="#shop"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Explore Shop
            </a>
            <a
              href="#contact"
              className="px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition"
            >
              Contact Us
            </a>
          </div>
        </div>
  
        {/* Hero Image */}
        <div className="mt-10 lg:mt-0 max-w-md">
          <img
            src="https://i.imgur.com/RLzMZ3K.png" // Replace with your image
            alt="RPM Meter"
            className="w-full rounded-lg shadow-xl"
          />
        </div>
      </section>
    );
  };
  
  export default Hero;
  