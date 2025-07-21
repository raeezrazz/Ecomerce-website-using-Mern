import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { resendOtp, signUp, verifyOtp } from '../../api/user';
import RegisterForm from './RegisterForm';
import OtpVerification from './OtpVerification';
import Success from './Success';
import Loading from './Loading';

const LoginModal = ({ onClose, page }) => {
  const isLogin = page === 'login';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('mhdrahees67@gmail.com');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showOtpPage, setShowOtpPage] = useState(false );
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const [timer, setTimer] = useState(30);
  const [timerKey, setTimerKey] = useState(0);

  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const validate = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!phone && !isLogin) {
      newErrors.phone = 'Phone number is required';
    } else if (!isLogin && !/^\d{10}$/.test(phone)) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const validationErrors = validate();
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length === 0) {
        const formData = {
          email,
          phone,
          password,
          ...(isLogin ? {} : { name }),
        };

        const response = await signUp(formData);
        if (response.data.success) {
          setShowOtpPage(true);
          setTimer(30)
          setLoading(false)
        } else {
          setErrors({ general: response.data.message || 'Something went wrong' });
          setLoading(false)
        }
      }
    } catch (error) {
      console.error("❌ Signup failed:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    setLoading(true)
    const newErrors: { otp?: string } = {};
  
   
    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      newErrors.otp = 'Please enter a valid 6-digit OTP sent to your email address.';
      setErrors(newErrors);
      setLoading(false)
      return; 
    }
  

    const formData = {
      email,
      phone,
      password,
      ...(isLogin ? {} : { name }), 
      otp,
    };
  
    try {
      
      const response = await verifyOtp(formData);
      console.log(response, '✅ OTP verification response');
      if (response?.data?.success) {
        setLoading(false)
        setRegistrationSuccess(true); 
        setTimeout(() => {
          onClose(); //
        }, 3000);
      } else  {
        setErrors({ otp: response.message || 'OTP verification failed' });
        setLoading(false)
      }
    } catch (error) {
      console.error('❌ Error verifying OTP:', error);
      setErrors({ otp: 'Something went wrong. Please try again.' });
    }
  };
  
  const handleResendClick =async() => {
    setIsResendDisabled(true); 
    setTimer(30);   
    setTimerKey(prev => prev + 1);
    const response = await resendOtp(email)
    setErrors({otp :"Otp resent successfully"})      

  };


  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const timer = setTimeout(() => setErrors({}), 3000);
      return () => clearTimeout(timer);
    }
  }, [errors]);


  useEffect(() => {
    let interval;
  
    if (showOtpPage) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
  
    return () => clearInterval(interval);
  }, [showOtpPage, timerKey]); 
  
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
        onClick={(e) => e.stopPropagation()} // Prevent click-outside close
      >
        {Object.keys(errors).length > 0 && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg shadow-md w-[90%] md:w-[80%] max-w-md text-sm space-y-1">
            {Object.entries(errors).map(([field, errMsg]) => (
              <p key={field}>{errMsg}</p>
            ))}
          </div>
        )}

        {/* Left side (image/text) */}
        <div className="w-1/2 bg-gradient-to-br from-blue-700 to-blue-500 text-white p-10 hidden md:flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">Welcome to RK Meter Service</h2>
          <p className="text-lg">
            {isLogin
              ? 'Login to manage your service requests.'
              : 'Register to request new services or manage existing ones.'}
          </p>
        </div>

        {/* Right side (form) */}
        <div className="w-full md:w-1/2 p-8 relative flex flex-col justify-center min-h-[480px]">

      {showOtpPage ? (
      <button
    onClick={()=>setShowOtpPage(false)} //
    className="absolute text-xl top-2 left-8 text-gray-500 hover:text-gray-800 text-xl font-bold"
  >
    ←
  </button>):(<></>)}
  

  {/* Close Button (Top Right) */}
  <button
    onClick={onClose}
    className="absolute top-2 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
  >
    ×
  </button>
          {loading ? (
           <Loading/>
          ) : registrationSuccess ? (
            <Success/>
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

      
          ): (
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
          />
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default LoginModal;
