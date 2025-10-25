import React, { useEffect, useState, useRef } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { api } from '../../lib/api';
import { showError } from '../../lib/utils/toast';
import { handleApiResponse, createErrorMessage } from '../../lib/utils/apiResponse';
import type { CreatePaymentOrderResponse } from '../../lib/types/site';

interface PayPalPaymentProps {
  bookingId: string;
  amount: number;
  currency: string;
  onSuccess: (orderId: string) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

// Validate PayPal Client ID
if (!PAYPAL_CLIENT_ID || PAYPAL_CLIENT_ID.length < 10) {
  console.error('PayPal: Invalid Client ID detected. Please check VITE_PAYPAL_CLIENT_ID in .env file');
}

// PayPal Button Component
const PayPalButtonComponent: React.FC<{
  bookingId: string;
  amount: number;
  currency: string;
  onSuccess: (orderId: string) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}> = ({ bookingId, amount, currency, onSuccess, onError: onErrorCallback, onCancel: onCancelCallback }) => {
  const [{ isPending }] = usePayPalScriptReducer();
  const [paymentOrder, setPaymentOrder] = useState<CreatePaymentOrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sdkLoadTimeout, setSdkLoadTimeout] = useState(false);
  const hasCreatedOrder = useRef(false);

  // Debug logging
  console.log('PayPalPayment: Component mounted/updated with bookingId:', bookingId);

  // Track component lifecycle
  useEffect(() => {
    console.log('PayPalPayment: Component mounted');
    
    // Set timeout for SDK loading
    const timeout = setTimeout(() => {
      if (isPending) {
        console.warn('PayPal: SDK loading timeout after 15 seconds');
        setSdkLoadTimeout(true);
      }
    }, 15000);

    return () => {
      console.log('PayPalPayment: Component unmounted');
      clearTimeout(timeout);
    };
  }, [isPending]);

  useEffect(() => {
    // Prevent duplicate API calls
    if (hasCreatedOrder.current || paymentOrder || isLoading) {
      console.log('PayPal: Payment order already created or in progress, skipping...');
      return;
    }

    const createPaymentOrder = async () => {
      try {
        hasCreatedOrder.current = true;
        setIsLoading(true);
        console.log('PayPal: Creating payment order for booking ID:', bookingId);
        
        const orderResponse = await api.createPaymentOrder(bookingId);
        console.log('PayPal: Payment order response:', orderResponse);
        
        // Handle API response with proper message display
        const paymentOrderData = handleApiResponse(
          orderResponse,
          'Payment Ready',
          'Payment Order Failed'
        );
        
        if (paymentOrderData) {
          setPaymentOrder(orderResponse);
        } else {
          const errorMessage = createErrorMessage(orderResponse);
          onErrorCallback(errorMessage);
          return;
        }
      } catch (error: any) {
        console.error('PayPal: Payment order creation error:', error);
        showError('Payment Error', error.message || 'Failed to create payment order');
        onErrorCallback(error.message || 'Failed to create payment order');
        hasCreatedOrder.current = false; // Reset on error to allow retry
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentOrder();
  }, [bookingId]); // Only depend on bookingId to prevent duplicate calls

  const createOrder = async () => {
    if (!paymentOrder?.data?.orderId) {
      throw new Error('Payment order not available');
    }
    return paymentOrder.data.orderId;
  };

  const onApprove = async (data: any) => {
    try {
      console.log('PayPal: Payment approved, data:', data);
      setIsLoading(true);
      
      const captureResponse = await api.capturePayment(data.orderID);
      console.log('PayPal: Payment capture response:', captureResponse);
      
      // Handle API response with proper message display
      const captureData = handleApiResponse(
        captureResponse,
        'Payment Successful',
        'Payment Capture Failed'
      );
      
      if (captureData) {
        onSuccess(data.orderID);
      } else {
        const errorMessage = createErrorMessage(captureResponse);
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('PayPal: Payment capture error:', error);
      showError('Payment Failed', error.message || 'Failed to capture payment');
      onErrorCallback(error.message || 'Payment capture failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayPalError = (err: any) => {
    console.error('PayPal: Payment error:', err);
    showError('Payment Error', 'An error occurred during payment');
    onErrorCallback('Payment failed');
  };

  const handlePayPalCancel = () => {
    console.log('PayPal: Payment cancelled by user');
    onCancelCallback();
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Processing payment...</p>
      </div>
    );
  }

  if (isPending && !sdkLoadTimeout) {
    console.log('PayPal: SDK is still loading (isPending: true)');
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading PayPal...</p>
        <p className="text-xs text-gray-500 mt-2">This may take a few seconds</p>
      </div>
    );
  }

  if (sdkLoadTimeout) {
    console.log('PayPal: SDK loading timeout, showing fallback');
    return (
      <div className="text-center py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-4">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">PayPal Loading Issue</h3>
          <p className="text-yellow-700 mb-4">
            PayPal is taking longer than expected to load. This might be due to network issues.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => {
                console.log('PayPal: Retrying SDK load');
                setSdkLoadTimeout(false);
                window.location.reload();
              }}
              className="btn-primary mr-2"
            >
              Retry PayPal
            </button>
            <button
              onClick={() => onCancelCallback()}
              className="btn-secondary"
            >
              Cancel Payment
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          If the issue persists, please try refreshing the page or contact support.
        </p>
      </div>
    );
  }

  return (
    <div className="paypal-payment-container">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="font-semibold">{currency} {amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-semibold">PayPal</span>
          </div>
        </div>
      </div>

      <div className="text-center mb-4">
        <p className="text-sm text-gray-600 mb-4">
          Click the PayPal button below to complete your payment securely
        </p>
      </div>

      {paymentOrder ? (
        <>
          {console.log('PayPal: Rendering PayPalButtons with paymentOrder:', paymentOrder)}
          <PayPalButtons
            createOrder={createOrder}
            onApprove={onApprove}
            onError={handlePayPalError}
            onCancel={handlePayPalCancel}
            style={{
              layout: 'vertical',
              color: 'blue',
              shape: 'rect',
              label: 'paypal',
            }}
          />
        </>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-gray-600 mb-4">
            Preparing payment...
          </p>
          <p className="text-xs text-gray-500">
            Waiting for payment order creation...
          </p>
        </div>
      )}
      
      {paymentOrder && paymentOrder.data && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Booking ID: {bookingId} | Order ID: {paymentOrder.data.orderId}
          </p>
        </div>
      )}
    </div>
  );
};

export const PayPalPayment: React.FC<PayPalPaymentProps> = (props) => {
  console.log('PayPalPayment: Rendering with props:', props);

  // Test PayPal SDK availability
  useEffect(() => {
    const checkPayPalSDK = () => {
      if ((window as any).paypal) {
        console.log('PayPal: SDK is available globally');
      } else {
        console.log('PayPal: SDK not yet available');
      }
    };
    
    checkPayPalSDK();
    const interval = setInterval(checkPayPalSDK, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return <PayPalButtonComponent {...props} />;
};