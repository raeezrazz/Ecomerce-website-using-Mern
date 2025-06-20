import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { signUp } from '../../api/user';

const LoginModal = ({ onClose, page }) => {
  const isLogin = page === 'login';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin && !name.trim()) {
      newErrors.name = 'Full name is required';
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    try {
      const validationErrors = validate();
      setErrors(validationErrors);
      console.log("started to sent")
      if (Object.keys(validationErrors).length === 0) {
        const formData = {
          email,
          phone,
          password,
          ...(isLogin ? {} : { name }),
        };
  
        console.log('Submitting:', formData);
        const response = await signUp(formData)
        console.log(response,"here is the response")
        onClose();
      }
    } catch (error: any) {
      console.error("❌ Signup failed:", error.response?.data || error.message);
    }
  
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const timer = setTimeout(() => setErrors({}), 3000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        className="relative flex w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 15 }}
        onClick={(e) => e.stopPropagation()}
      >
        {Object.keys(errors).length > 0 && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg shadow-md w-[90%] md:w-[80%] max-w-md text-sm space-y-1">
            {Object.entries(errors).map(([field, errMsg]) => (
               <p key={field}>{errMsg}</p>
              ))}
          </div>
        )}

        <div className="w-1/2 bg-blue-600 text-white p-10 hidden md:flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">Welcome to RK Meter Service</h2>
          <p className="text-lg">
            {isLogin
              ? 'Login to manage your service requests.'
              : 'Register to request new services or manage existing ones.'}
          </p>
        </div>

        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {isLogin ? 'Login' : 'Register'}
          </h2>

          {!isLogin && (
            <div className="relative mb-4">
              <input
                type="text"
                placeholder=" "
                onChange={(e) => setName(e.target.value)}
                className="peer w-full px-3 pt-4 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <label className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600">
                Full Name
              </label>
            </div>
          )}
          <div className="relative mb-6">
            <input
              type="email"
              placeholder=" "
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full px-3 pt-4 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <label className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600">
              Email
            </label>
          </div>

          {!isLogin && (
          <div className="relative mb-4">
            <input
              type="tel"
              placeholder=" "
              onChange={(e) => setPhone(e.target.value)}
              className="peer w-full px-3 pt-4 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <label className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600">
              Phone Number
            </label>
          </div>
         )}
          <div className="relative mb-4">
            <input
              type="password"
              placeholder=" "
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full px-3 pt-4 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <label className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600">
              Password
            </label>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginModal;