import React from 'react';
import { FaSearch } from 'react-icons/fa';
import freeShip from '../../assets/freeShip.png'
import rpmLogo from '../../assets/rpmLogo.png'


export default function Header() {
  return (
    <header>
    <div className="bg-blue-600 text-white shadow-md">
      <div className="max-w-4xl mx-auto px-6   flex justify-between items-center">
        <nav className="space-x-4 ">
          <a href="#" className="text-xs hover:rotate-6 transition">Home</a>
          <a href="#" className="text-xs hover:underline">Shop</a>
          <a href="#" className="text-xs hover:underline">Contact</a>
        </nav>
        <div className='flex justify-between items-center'>
            <img className='w-6 h-3 mt-1 pr-2 bg-white-300' src={freeShip} alt="" />
            <h1 className='text-xs'>Free shipping All over India</h1>
        </div>
      </div>
      
    </div>
    <div className='flex justify-between items-center m-3 '>
        <div className="flex items-center space-x-2">
            <img className='w-13 items-' src={rpmLogo} alt="" />
            <h1 className="text-xl font-bold text-indigo-600">
            Rs <span className="text-pink-500">Meters</span>
            </h1>
        </div>
        <div className="flex items-center border border-black-300  px-4 py-2 w-[30%] h-[8%] max-w-md shadow-sm bg-white">
            <input
                 type="text"
                  placeholder="Search products..."
                className="flex-grow outline-none bg-black-200 text-xs "
                />
            <button className="text-gray-500 hover:text-gray-700">
            <FaSearch className='text-blue-800 w-3' />
            </button>
        </div>
        <div>
            login register
        </div>
    </div>
    </header>
  );
}
