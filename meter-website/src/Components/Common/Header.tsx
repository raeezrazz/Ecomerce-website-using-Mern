import React ,{useState} from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FaSearch } from 'react-icons/fa';
import freeShip from '../../assets/freeShip.png'
import LoginModal from './LoginModal';
import BikeBrandNavbar from './BikeBrandNavbar';
import rpmLogo from '../../assets/rpmLogo.png'


export default function Header() {

   
        const [openMenu, setOpenMenu] = useState(null);
        const [isOpen, setIsOpen] = useState('');
        const toggleMenu = (menuName) => {
          setOpenMenu(openMenu === menuName ? null : menuName);
        };

  return (
    <header>
    <div className="bg-blue-600 text-white shadow-lg">
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
    <div className='flex justify-between items-center m-2 '>
        <div className="flex items-center space-x-2">
            <img className='w-13 items-' src={rpmLogo} alt="" />
            <h1 className="text-xl font-bold text-indigo-600">
            Rk <span className="text-pink-500">Meters</span>
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
      <div className='flex'>
        
      <svg
        className="w-4  text-blue-600"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
        />
      </svg>
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            layoutId="loginBox"
            onClick={() => setIsOpen('login')} 
            className="text-blue-600 text-sm"
          >
            Login
          </motion.button>
        ):(<button className="text-blue-600 text-sm" onClick={()=>setIsOpen('')}>Login</button>)}

      </AnimatePresence>
    
           
            <h2 className='m-1 text-sm'>or</h2>
            <AnimatePresence>
        {!isOpen ? (
          <motion.button
            layoutId="loginBox"
            onClick={() => setIsOpen('register') }
          
            className="text-blue-600 text-sm"
          >
            Register
          </motion.button>
        ):(<button className="text-blue-600 text-sm" onClick={()=>setIsOpen(false)}>Register</button>)}

        {isOpen && <LoginModal onClose={() => setIsOpen(false)} page={isOpen}    />}
      </AnimatePresence>

            {/* <button className='text-blue-600 text-sm'>Register </button> */}
        </div>
    </div>
    {/* <div className="bg-blue-600 flex  text-white shadow-md " > */}
    <BikeBrandNavbar/>

    {/* </div> */}
    
    </header>
  );
}
