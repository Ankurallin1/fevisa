import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { showError } from '../lib/utils/toast';
import { handleApiResponse, createErrorMessage } from '../lib/utils/apiResponse';
import type { PaymentCaptureResponse } from '../lib/types/site';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentResult, setPaymentResult] = useState<PaymentCaptureResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = searchParams.get('token');
  // const payerId = searchParams.get('PayerID');

  useEffect(() => {
    if (!token) {
      setError('No payment token found');
      setIsProcessing(false);
      return;
    }

    capturePayment();
  }, [token]);

  const capturePayment = async () => {
    if (!token) return;

    try {
      setIsProcessing(true);
      const response = await api.capturePayment(token);
      
      // Handle API response with proper message display
      const captureData = handleApiResponse(
        response,
        'Payment Confirmed',
        'Payment Error'
      );
      
      if (captureData) {
        setPaymentResult(response);
      } else {
        const errorMessage = createErrorMessage(response);
        setError(errorMessage);
      }
    } catch (error: any) {
      console.error('Payment capture error:', error);
      setError(error.message || 'Failed to confirm payment');
      showError('Payment Error', error.message || 'Failed to confirm payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinue = () => {
    navigate('/dashboard');
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Confirming Payment</h2>
          <p className="text-gray-600">Please wait while we confirm your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/book')}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <div className="text-green-600 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-6">
          Your consultation has been confirmed and payment has been processed.
        </p>
        
        {paymentResult && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6 text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold">
                  {paymentResult.data.currency} {paymentResult.data.amount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-semibold text-green-600 capitalize">
                  {paymentResult.data.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono text-sm">{paymentResult.data.paypalOrderId}</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleContinue}
            className="btn-primary w-full"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate('/book')}
            className="btn-secondary w-full"
          >
            Book Another Consultation
          </button>
        </div>
      </div>
    </div>
  );
}


