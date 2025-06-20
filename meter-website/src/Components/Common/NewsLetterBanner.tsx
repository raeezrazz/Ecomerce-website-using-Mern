import React from 'react';

const NewsletterBanner = () => {
  return (
    <div className="bg-blue-50 py-10 px-6 sm:px-12 rounded-xl shadow-md mt-12 mb-16 text-center max-w-4xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
        🎉 Subscribe and get <span className="text-blue-600">10% OFF</span> your first order!
      </h2>
      <p className="text-gray-600 mb-4">Join our mailing list to stay updated on new offers, product launches, and more.</p>

      <form className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-4">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full sm:w-[300px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default NewsletterBanner;
