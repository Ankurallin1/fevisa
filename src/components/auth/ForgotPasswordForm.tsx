import React, { useState } from 'react';
import { useAuth } from '../../lib/contexts/AuthContext';

interface ForgotPasswordFormProps {
  onSuccess?: (email: string) => void;
  onBack?: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSuccess,
  onBack,
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await forgotPassword(email);
      if (response.success) {
        setSuccess(true);
        onSuccess?.(email);
      } else {
        setError(response.message || 'Failed to send reset email');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Sent!</h2>
          <p className="text-gray-600 mb-4">
            We've sent a password reset OTP to <strong>{email}</strong>
          </p>
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
      
      <p className="text-gray-600 text-center mb-6">
        Enter your email address and we'll send you a verification code to reset your password.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email address"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Sending...' : 'Send Reset Code'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 text-sm"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};
