import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { login, resendOtp, signUp, verifyOtp } from '../../api/user';
import RegisterForm from './RegisterForm';
import OtpVerification from './OtpVerification';
import Success from './Success';
import Loading from './Loading';
import { loginSchema, registerSchema, otpSchema } from '../../validation/authSchema';
import { ZodError } from 'zod';
import { setCredentials } from '../../store/Slice/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const LoginModal = ({ onClose, page }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(page === 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('mhdrahees67@gmail.com');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [showOtpPage, setShowOtpPage] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [timer, setTimer] = useState(30);
  const [timerKey, setTimerKey] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  // Handle form submission (Login or Register)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setErrorMessage('');

    const formData = {
      email,
      password,
      ...(isLogin ? {} : { name, phone }),
    };

    try {
      const parsedData = isLogin
        ? loginSchema.parse(formData)
        : registerSchema.parse(formData);

      const response = await (isLogin? login(parsedData) :signUp(parsedData) ) ;

      if (response.data.success) {
        if (isLogin) {
          dispatch(setCredentials(response.data.data));
          localStorage.setItem('accessToken', response.data.accessToken);
          onClose();
          navigate('/');
        } else {
          setShowOtpPage(true);
          setTimer(30);
        }
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors = {};
        error.issues.forEach((issue) => {
          fieldErrors[issue.path[0]] = issue.message;
        });
        setErrors(fieldErrors);
      } else if (error?.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP submission
  const handleOtpSubmit = async () => {
    setLoading(true);
    setErrors({});
    setErrorMessage('');

    try {
      otpSchema.parse({ otp });

      const formData = {
        email,
        phone,
        password,
        ...(isLogin ? {} : { name }),
        otp,
      };

      const response = await verifyOtp(formData);

      if (response?.data?.success) {
        dispatch(setCredentials(response.data.data));
        localStorage.setItem('accessToken', response.data.accessToken);
        setRegistrationSuccess(true);
        setTimeout(() => onClose(), 3000);
      } else {
        setErrors({ otp: response.message || 'OTP verification failed' });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors = {};
        error.issues.forEach((e) => {
          fieldErrors[e.path[0]] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ otp: 'Something went wrong. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResendClick = async () => {
    setIsResendDisabled(true);
    setTimer(30);
    setTimerKey((prev) => prev + 1);
    await resendOtp(email);
    setErrors({ otp: 'OTP resent successfully' });
  };

  // Auto-clear errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const timer = setTimeout(() => setErrors({}), 3000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  // Countdown Timer
  useEffect(() => {
    let interval;

    if (showOtpPage) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [showOtpPage, timerKey]);

  // Enable resend after timer ends
  useEffect(() => {
    if (timer === 0) {
      setIsResendDisabled(false);
    }
  }, [timer]);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        className="relative flex w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden min-h-[500px]"
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

        {/* Left Panel */}
        <div className="w-1/2 bg-gradient-to-br from-blue-700 to-blue-500 text-white p-10 hidden md:flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">Welcome to RK Meter Service</h2>
          <p className="text-lg">
            {isLogin
              ? 'Login to manage your service requests.'
              : 'Register to request new services or manage existing ones.'}
          </p>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 p-8 relative flex flex-col justify-center min-h-[480px]">
          {/* Back button on OTP page */}
          {showOtpPage && (
            <button
              onClick={() => setShowOtpPage(false)}
              className="absolute top-2 left-4 text-gray-600 hover:text-black text-2xl font-bold"
            >
              ←
            </button>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-4 text-gray-600 hover:text-black text-2xl font-bold"
          >
            ×
          </button>

          {/* Global error message */}
          {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}

          {/* View rendering */}
          {loading ? (
            <Loading />
          ) : registrationSuccess ? (
            <Success />
          ) : showOtpPage ? (
            <OtpVerification
              email={email}
              otp={otp}
              setOtp={setOtp}
              handleOtpSubmit={handleOtpSubmit}
              handleResendClick={handleResendClick}
              isResendDisabled={isResendDisabled}
              timer={timer}
            />
          ) : (
            <RegisterForm
              isLogin={isLogin}
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              phone={phone}
              setPhone={setPhone}
              password={password}
              setPassword={setPassword}
              handleSubmit={handleSubmit}
              toggleForm={() => setIsLogin(!isLogin)}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default LoginModal;
 