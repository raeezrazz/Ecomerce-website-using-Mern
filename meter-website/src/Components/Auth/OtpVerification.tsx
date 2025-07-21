import React from 'react';

interface OtpVerificationProps {
  email: string;
  otp: string;
  setOtp: (value: string) => void;
  handleOtpSubmit: () => void;
  handleResendClick: () => void;
  isResendDisabled: boolean;
  timer: number;
}

const OtpVerification: React.FC<OtpVerificationProps> = ({
  email,
  otp,
  setOtp,
  handleOtpSubmit,
  handleResendClick,
  isResendDisabled,
  timer,
}) => {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">
        OTP Sent Successfully
      </h2>
      <p className="text-center text-sm text-gray-600 mb-6">
        Please enter the OTP sent to
        <span className="text-gray-800 font-medium ml-1">{email}</span>
      </p>

      <div className="mb-4">
        <label
          htmlFor="otpName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Enter 6 Digit OTP sent to your Email
        </label>
        <input
          id="otpName"
          type="text"
          placeholder="Otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <button
        onClick={handleOtpSubmit}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Verify OTP
      </button>

      <div className="text-center mt-4">
        {isResendDisabled ? (
          <p className="text-sm text-gray-500">Resend OTP in {timer} sec</p>
        ) : (
          <button
            onClick={handleResendClick}
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            Resend OTP
          </button>
        )}
      </div>
    </>
  );
};

export default OtpVerification;
