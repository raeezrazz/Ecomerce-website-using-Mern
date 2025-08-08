import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
// Importing icons from react-icons. You can choose different icons or a different library.
import { FaUser, FaBox, FaMapMarkerAlt, FaCreditCard, FaCog, FaSignOutAlt } from 'react-icons/fa';

function ProfileSideBar() {
    const [isOpen, setIsOpen] = useState(false);

    // Define your navigation links with icons
    const profileLinks = [
        { name: "My Profile", path: "/profile/dashboard", icon: <FaUser /> },
        { name: "My Orders", path: "/profile/orders", icon: <FaBox /> },
        { name: "Address Management", path: "/profile/addresses", icon: <    /> },
        { name: "Payment Methods", path: "/profile/payments", icon: <FaCreditCard /> },
        { name: "Account Settings", path: "/profile/settings", icon: <FaCog /> },
    ];

    return (
        <>
            {/* Mobile Toggle Button (unchanged) */}
            <div className="md:hidden flex justify-between items-center mb-4">
                
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-sm text-blue-600 underline"
                >
                    {isOpen ? 'Hide Menu' : 'Show Menu'}
                </button>
            </div>

            {/* Profile Navigation Panel */}
            <aside
                className={`md:w-1/4 w-full space-y-6 pr-4 transition-all duration-300 ease-in-out ${
                    isOpen ? 'block' : 'hidden'
                } md:block`}
            >
                <div className='shadow-lg p-3    rounded-lg  bg-white'>
                    {/* Brand/Logo and Title Section */}
                   

                    
                    
                    {/* Navigation Links */}
                    <div className='pl-2'> {/* Added a small left padding to align with the icons */}
                       
                        <nav>
                            <ul className="space-y-2">
                                {profileLinks.map((link) => (
                                    <li key={link.name}>
                                        <NavLink
                                            to={link.path}
                                            className={({ isActive }) =>
                                                `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                                    isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
                                                }`
                                            }
                                            onClick={() => setIsOpen(false)} // Close sidebar on mobile
                                        >
                                            <span className='mr-3 text-lg'>
                                                {link.icon}
                                            </span>
                                            {link.name}
                                        </NavLink>
                                    </li>
                                ))}
                                
                                <li>
                                    <button 
                                        className="flex items-center w-full px-3 py-2 text-left text-sm font-medium rounded-lg text-gray-700 hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
                                        onClick={() => {
                                            // Handle logout logic here
                                        }}
                                    >
                                        <span className='mr-3 text-lg'>
                                            <FaSignOutAlt />
                                        </span>
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </aside>
        </>
    );
}

export default ProfileSideBar;