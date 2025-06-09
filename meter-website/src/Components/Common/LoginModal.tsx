// components/LoginModal.jsx
import { motion } from 'motion/react';

const LoginModal = ({ onClose ,page  }) => {  
  return (
   
       
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-10" onClick={onClose}>
    <motion.div
      layoutId="loginBox"
      className="flex  w-xl w-xl bg-white p-8 rounded-2xl shadow-2xl border border-gray-100"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 15 }}
      onClick={(e) => e.stopPropagation()} // Prevent close on modal click
    >
        <div className='bg-blue-300'>svdksfvlfsvfdkvm,vklmdfkvmkdfvmkfdmlfdsvklvmkfdlvmdvd,f.dv</div>
         <div >
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 tracking-tight">
        Welcome Back 👋
      </h2>
  
      {/* Floating input fields */}
      <div className="relative mb-4">
        <input
          type="email"
          placeholder=" "
          className="peer w-full px-3 pt-4 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <label className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600">
          Email
        </label>
      </div>
      <div className="relative mb-4">
        <input
          type="number"
          placeholder=" "
          className="peer w-full px-3 pt-4 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <label className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600">
          Phone Number
        </label>
      </div>
  
      <div className="relative mb-6">
        <input
          type="password"
          placeholder=" "
          className="peer w-full px-3 pt-4 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <label className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600">
          Password
        </label>
      </div>
  
      {/* Submit Button */}
      <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
        Submit
      </button>
  
      {/* Cancel Button */}
      <button
        onClick={onClose}
        className="mt-4 text-sm text-gray-500 hover:text-gray-800 hover:underline block mx-auto"
      >
        Cancel
      </button>
      </div>
    </motion.div>
  </div>
  
  
  );
};

export default LoginModal;
