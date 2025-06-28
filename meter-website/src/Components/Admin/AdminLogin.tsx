import React from "react";
import { LogIn } from "lucide-react";

const AdminLogin = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f6fc] px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8">
        {/* Logo & Title */}
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-semibold mt-4 text-gray-800">Admin Login</h2>
          <p className="text-sm text-gray-500">Access RK Meters control panel securely</p>
        </div>

        {/* Login Form */}
        <form className="space-y-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              placeholder="admin@rkmeter.com"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="form-checkbox text-blue-500" />
              Remember me
            </label>
            <a href="#" className="text-blue-500 hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-all"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} RK Meters Admin
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
