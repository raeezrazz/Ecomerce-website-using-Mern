// RegisterForm.tsx
import React from 'react';

type RegisterFormProps = {
  isLogin: boolean;
  name: string;
  setName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  toggleForm: () => void;
};

function RegisterForm({
  isLogin,
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  password,
  setPassword,
  handleSubmit,
  toggleForm,
}: RegisterFormProps) {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {isLogin ? 'Login' : 'Register'}
      </h2>

      {!isLogin && (
        <div className="relative mb-4">
          <input
            type="text"
            placeholder=" "
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="peer w-full h-9 px-3 pt-4 pb-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {name === '' && (
            <label className="absolute left-3 top-2 text-sm text-gray-500 transition-all">
              Enter Name
            </label>
          )}
        </div>
      )}

      <div className="relative mb-4">
        <input
          type="email"
          placeholder=" "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="peer w-full h-9 px-3 pt-4 pb-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {email === '' && (
          <label className="absolute left-3 top-2 text-sm text-gray-500 transition-all">
            Enter Email
          </label>
        )}
      </div>

      {!isLogin && (
        <div className="relative mb-4">
          <input
            type="number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder=" "
            className="peer w-full h-9 px-3 pt-4 pb-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {phone === '' && (
            <label className="absolute left-3 top-2 text-sm text-gray-500 transition-all">
              Phone Number
            </label>
          )}
        </div>
      )}

      <div className="relative mb-6">
        <input
          type="password"
          value={password}
          placeholder=" "
          onChange={(e) => setPassword(e.target.value)}
          className="peer w-full px-3 h-9 pt-4 pb-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {password === '' && (
          <label className="absolute left-3 top-2 text-sm text-gray-500 transition-all">
            Enter Password
          </label>
        )}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
      >
        {isLogin ? 'Login' : 'Register'}
      </button>

      <button className="w-full mt-4 py-2 border border-gray-300 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-100 transition">
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-5 h-5"
        />
        Continue with Google
      </button>

      <p className="text-sm text-gray-600 text-center mt-4">
        {isLogin ? (
          <>
            Don’t have an account?{' '}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={toggleForm}
            >
              Register
            </span>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={toggleForm}
            >
              Login
            </span>
          </>
        )}
      </p>
    </>
  );
}

export default RegisterForm;
