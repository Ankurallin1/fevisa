import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/contexts/AuthContext';

interface OtpVerificationFormProps {
  email: string;
  onSuccess?: () => void;
  onBack?: () => void;
  onResend?: () => void;
}

export const OtpVerificationForm: React.FC<OtpVerificationFormProps> = ({
  email,
  onSuccess,
  onBack,
}) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  const { verifyOtp, resendOtp } = useAuth();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      setIsLoading(false);
      return;
    }

    try {
      const response = await verifyOtp(email, otp);
      if (response.success) {
        onSuccess?.();
      } else {
        setError(response.message || 'OTP verification failed');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await resendOtp(email);
      if (response.success) {
        setCountdown(60); // 60 seconds countdown
        setError('');
      } else {
        setError(response.message || 'Failed to resend OTP');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to resend OTP');
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Verify Email</h2>
      
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded">
        <p className="text-sm">
          We've sent a 6-digit verification code to <strong>{email}</strong>
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
            Verification Code
          </label>
          <input
            type="text"
            id="otp"
            name="otp"
            value={otp}
            onChange={handleOtpChange}
            required
            maxLength={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest"
            placeholder="000000"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || otp.length !== 6}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>

      <div className="mt-4 text-center space-y-2">
        <div>
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={countdown > 0}
            className="text-blue-600 hover:text-blue-800 text-sm disabled:opacity-50"
          >
            {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            Back to Signup
          </button>
        </div>
      </div>
    </div>
  );
};
