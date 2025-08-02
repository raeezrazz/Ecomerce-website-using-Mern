import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FaSearch } from 'react-icons/fa';
import freeShip from '../../assets/freeShip.png';
import LoginModal from '../Auth/LoginModal';
import BikeBrandNavbar from './BikeBrandNavbar';
import rpmLogo from '../../assets/rpmLogo.png';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/Slice/userSlice';

export default function Header() {
  const [isOpen, setIsOpen] = useState('');
  const user = useSelector((state) => state.userInfo?.userInfo); // adjust according to your store
  useSelector((state)=>console.log(state,"here is the state hhhhhhhhhhhh",state.user))
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('accessToken');
  };

  return (
    <header className='bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700'>
      <div className="text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
          <nav className="space-x-4">
            <a href="#" className="text-xs hover:underline">Home</a>
            <a href="#" className="text-xs hover:underline">Shop</a>
            <a href="#" className="text-xs hover:underline">Contact</a>
          </nav>
          <div className='flex items-center'>
            <img className='w-6 h-3 mt-1 pr-2' src={freeShip} alt="Free shipping" />
            <h1 className='text-xs'>Free shipping all over India</h1>
          </div>
        </div>
      </div>

      <div className='flex justify-between items-center m-2'>
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img className='w-14' src={rpmLogo} alt="RPM Logo" />
          <h1 className="text-xl font-bold text-black"
            style={{ textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff' }}>
            Rs<span className="text-red-500">Meters</span>
          </h1>
        </div>

        {/* Search */}
        <div className="flex items-center px-4 py-2 w-[30%] max-w-md bg-white border border-gray-300 rounded-full shadow-lg">
          <input
            type="text"
            placeholder="Search products..."
            className="flex-grow bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
          />
          <button className="text-blue-800">
            <FaSearch className="w-4 h-4" />
          </button>
        </div>

        {/* User Auth Buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-white text-sm">Hi, {user.name || 'User'}</span>
              <button
                onClick={handleLogout}
                className="text-sm bg-white text-blue-800 px-3 py-1 rounded-full hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <motion.button
                layoutId="loginBox"
                onClick={() => setIsOpen('login')}
                className="text-white text-sm font-medium hover:text-gray-300"
              >
                Login
              </motion.button>
              <span className="text-white text-sm">or</span>
              <motion.button
                layoutId="registerBox"
                onClick={() => setIsOpen('register')}
                className="text-white text-sm font-medium hover:text-gray-300"
              >
                Register
              </motion.button>
              <AnimatePresence>
                {isOpen && (
                  <LoginModal
                    onClose={() => setIsOpen('')}
                    page={isOpen}
                  />
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>

      <BikeBrandNavbar />
    </header>
  );
}
