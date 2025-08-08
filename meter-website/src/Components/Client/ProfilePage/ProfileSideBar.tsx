import React from "react";
import {
  FaBox,
  FaCog,
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";

import { logout } from "../../../store/Slice/userSlice";

function ProfileSideBar() {
  const dispatch = useDispatch();
  const linkClass = ({ isActive }) =>
    // Phone styles are applied without the 'md:' prefix.
    // Desktop styles are applied with the 'md:' prefix.
     `w-full flex items-center px-3 py-2  transition-colors duration-200 whitespace-nowrap font-xs 
      ${
        isActive
          ? "text-gray-700 bg-gray-100 md:bg-indigo-600 md:text-white md:shadow-md"
          : "text-blue-900 hover:text-indigo-600 md:text-gray-700 md:hover:bg-gray-100"
      }
      md:w-full md:flex md:items-center md:px-3 md:py-2 md:text-sm md:font-large md:rounded-lg md:transition-colors md:duration-200`;
  const handleLogout = () => {
    console.log("logouting");
    dispatch(logout());
    localStorage.removeItem("accessToken");
    localStorage.removeItem("persist:user");
  };

  return (
    <aside
      className={`overflow-x-auto whitespace-nowrap scrollbar-hide
      md:w-1/4 md:space-y-6 md:pr-4 md:transition-all md:duration-300 md:ease-in-out`}
>
      <nav className="flex w-full md:flex-col md:space-y-2 md:space-x-0 ">
        <NavLink to="/profile" end className={linkClass}>
          <FaUser className="hidden md:mr-3 text-lg md:block" />
         <span className="text-lg">My Account</span>
        </NavLink>
        <NavLink to="address" className={linkClass}>
          <FaMapMarkerAlt className="hidden md:mr-3 text-lg md:block" />
          <span className="text-lg">Address Management</span>
        </NavLink>
        <NavLink to="orders" className={linkClass}>
          <span className="hidden md:mr-3 text-lg md:block">
            <FaBox className="hidden md:mr-3 text-lg md:block" />
          </span>
          <span className="text-lg">My Orders</span>
        </NavLink>
        <NavLink to="settings" className={linkClass}>
          <span className="mr-3 text-lg">
            <FaCog className="hidden md:mr-3 text-lg md:block" />
          </span>
          <span className="text-lg">Account Settings</span>
        </NavLink>
        <button
          className="flex items-center w-full px-3 py-2 text-left text-sm font-medium rounded-lg text-gray-700 hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
          onClick={handleLogout}
        >
          <span className="mr-3 text-lg">
            <FaSignOutAlt className="text-lg" />
          </span>
          <span className="text-lg"> Logout</span>
        </button>
      </nav>
    </aside>
  );
}

export default ProfileSideBar;
