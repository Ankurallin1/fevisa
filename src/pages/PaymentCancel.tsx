// import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function PaymentCancel() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');
  // const payerId = searchParams.get('PayerID');

  const handleTryAgain = () => {
    navigate('/book');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <div className="text-yellow-600 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h2>
        <p className="text-gray-600 mb-6">
          Your payment was cancelled. No charges have been made to your account.
        </p>
        
        {token && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6 text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono text-sm">{token}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-semibold text-yellow-600">Cancelled</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleTryAgain}
            className="btn-primary w-full"
          >
            Try Again
          </button>
          <button
            onClick={handleGoHome}
            className="btn-secondary w-full"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}




