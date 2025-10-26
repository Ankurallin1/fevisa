import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/contexts/AuthContext';
import { api } from '../../lib/api';
import { formatDate } from '../../lib/utils/format';
import { formatTime } from '../../lib/utils/timeFormat';
import { showError, showSuccess } from '../../lib/utils/toast';
import { handleApiResponse, createErrorMessage } from '../../lib/utils/apiResponse';
import { clearBookingSessionData } from '../../lib/utils/sessionCleanup';
import { PayPalPayment } from '../payment/PayPalPayment';
import type { AvailabilitySlot, PricingResponse, CreateBookingResponse } from '../../lib/types/site';

interface Step4PaymentProps {
  selectedSlot: AvailabilitySlot | null;
  selectedDate: string;
  notes: string;
  pricing: PricingResponse | null;
  onBack: () => void;
}

export const Step4Payment: React.FC<Step4PaymentProps> = ({
  selectedSlot,
  selectedDate,
  notes,
  pricing,
  onBack,
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<CreateBookingResponse | null>(() => {
    // Try to restore booking from session storage
    const savedBooking = sessionStorage.getItem('currentBooking');
    if (savedBooking) {
      try {
        return JSON.parse(savedBooking);
      } catch (error) {
        console.error('Failed to parse saved booking:', error);
        sessionStorage.removeItem('currentBooking');
      }
    }
    
    // Check if we have a booking ID from retry flow
    const retryBookingId = sessionStorage.getItem('retryBookingId');
    if (retryBookingId) {
      console.log('Step4Payment: Found retry booking ID:', retryBookingId);
      // Create a mock booking object for retry flow
      return {
        success: true,
        data: {
          id: retryBookingId,
          // We'll populate the rest from the API call
        }
      };
    }
    
    return null;
  });
  const [showPayPal, setShowPayPal] = useState(false);


  const handlePayment = async () => {
    console.log('Step4Payment: handlePayment called');
    console.log('Step4Payment: isAuthenticated:', isAuthenticated);
    console.log('Step4Payment: selectedSlot:', selectedSlot);
    console.log('Step4Payment: selectedDate:', selectedDate);
    console.log('Step4Payment: notes:', notes);
    console.log('Step4Payment: pricing:', pricing);
    console.log('Step4Payment: existing booking:', booking);

    if (!isAuthenticated) {
      console.log('Step4Payment: User not authenticated, redirecting to login');
      // Store booking data in session storage for after login
      const bookingData = {
        selectedSlot,
        selectedDate,
        notes,
        pricing,
        step: 4,
      };
      sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
      
      // Redirect to login with return URL
      navigate('/auth?redirect=/book&step=4');
      return;
    }

    // If booking already exists, just show PayPal
    if (booking && booking.data && booking.data.id) {
      console.log('Step4Payment: Booking already exists, showing PayPal for booking ID:', booking.data.id);
      setShowPayPal(true);
      showSuccess('Booking Found', 'Proceeding to payment for your existing booking');
      return;
    }

    // Check if this is a retry flow with existing booking ID
    const retryBookingId = sessionStorage.getItem('retryBookingId');
    if (retryBookingId) {
      console.log('Step4Payment: Retry flow detected, using existing booking ID:', retryBookingId);
      setShowPayPal(true);
      showSuccess('Retry Payment', 'Proceeding to payment for your existing booking');
      return;
    }

    console.log('Step4Payment: Starting booking creation process');
    setIsProcessing(true);
    setError(null);

    try {
      if (!selectedSlot || !pricing) {
        throw new Error('Missing booking information');
      }

      // Create booking first
      const bookingData = {
        date: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        duration: pricing.data.duration,
        notes: notes || 'Visa consultation appointment',
      };

      console.log('Step4Payment: Calling api.createBooking with data:', bookingData);
      const response = await api.createBooking(bookingData);
      console.log('Step4Payment: API response received:', response);
      
      // Handle API response with proper message display
      const bookingData_result = handleApiResponse(
        response,
        'Booking Created',
        'Booking Failed'
      );
      
      if (bookingData_result) {
        console.log('Booking created successfully:', response.data.id);
        setBooking(response);
        // Save booking to session storage
        sessionStorage.setItem('currentBooking', JSON.stringify(response));
        setShowPayPal(true);
      } else {
        const errorMessage = createErrorMessage(response);
        setError(errorMessage);
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      const errorMessage = error.message || 'Failed to create booking. Please try again.';
      setError(errorMessage);
      showError('Booking Error', errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = (orderId: string) => {
    console.log('Payment successful:', orderId);
    console.log('Booking data:', booking);
    showSuccess('Payment Successful', 'Your consultation has been confirmed!');
    
    // Clear all booking-related sessionStorage data
    clearBookingSessionData();
    
    // Use the booking ID for navigation, not the PayPal order ID
    const bookingId = booking?.data?.id || sessionStorage.getItem('retryBookingId');
    if (bookingId) {
      console.log('Navigating to booking confirmation with booking ID:', bookingId);
      navigate(`/booking/confirm/${bookingId}`);
    } else {
      console.error('No booking ID found for navigation');
      showError('Navigation Error', 'Unable to find booking details. Please contact support.');
      navigate('/dashboard');
    }
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    setError(error);
    setShowPayPal(false);
    
    // Check if it's a timeout error
    if (error.includes('timeout') || error.includes('Payment timeout')) {
      console.log('Payment timeout detected - clearing all booking data');
      clearAllBookingData();
      showError('Payment Timeout', 'Payment service is temporarily unavailable. Your booking data has been cleared. Please try again later.');
      navigate('/dashboard');
    }
  };

  const handlePaymentCancel = () => {
    console.log('Payment cancelled');
    setShowPayPal(false);
    showError('Payment Cancelled', 'Payment was cancelled. You can try again.');
  };

  const resetBooking = () => {
    console.log('Resetting booking');
    setBooking(null);
    setShowPayPal(false);
    sessionStorage.removeItem('currentBooking');
    showSuccess('Booking Reset', 'You can create a new booking now');
  };

  const clearAllBookingData = () => {
    console.log('Clearing all booking data due to timeout');
    
    // Clear all session storage related to booking
    sessionStorage.removeItem('currentBooking');
    sessionStorage.removeItem('bookingPricing');
    sessionStorage.removeItem('bookingSelectedDate');
    sessionStorage.removeItem('bookingAvailability');
    sessionStorage.removeItem('bookingSelectedSlot');
    sessionStorage.removeItem('bookingNotes');
    sessionStorage.removeItem('bookingCurrentStep');
    sessionStorage.removeItem('retryBookingId');
    
    // Reset component state
    setBooking(null);
    setShowPayPal(false);
    setError(null);
    setIsProcessing(false);
    
    console.log('All booking data cleared');
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600">
            Please sign in to complete your booking
          </p>
        </div>

        {/* Booking Summary */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Booking</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{formatDate(selectedDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="font-medium">
                {selectedSlot ? `${formatTime(selectedSlot.startTime)} - ${formatTime(selectedSlot.endTime)}` : 'Not selected'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">
                {pricing?.data?.currency} {pricing?.data?.amount}
              </span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handlePayment}
            className="btn-primary text-lg px-8 py-3"
          >
            Sign In to Complete Booking
          </button>
        </div>

        <div className="text-center mt-4">
          <button
            onClick={onBack}
            className="btn-secondary"
          >
            Back to Notes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete Payment</h2>
        <p className="text-gray-600">
          Review your booking details and complete payment
        </p>
      </div>

      {/* Booking Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">{formatDate(selectedDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time:</span>
            <span className="font-medium">
              {selectedSlot ? `${formatTime(selectedSlot.startTime)} - ${formatTime(selectedSlot.endTime)}` : 'Not selected'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium">{pricing?.data?.duration || 30} minutes</span>
          </div>
          {notes && (
            <div className="flex justify-between">
              <span className="text-gray-600">Notes:</span>
              <span className="font-medium text-sm">{notes.substring(0, 50)}{notes.length > 50 ? '...' : ''}</span>
            </div>
          )}
        </div>
      </div>

      {/* Show existing booking info */}
      {booking && booking.data && booking.data.id && !showPayPal && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-blue-900">Booking Already Created</h3>
                <p className="text-blue-700">Booking ID: {booking.data.id}</p>
                <p className="text-sm text-blue-600">Click "Proceed to Payment" to complete your payment</p>
              </div>
            </div>
            <button
              onClick={resetBooking}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Create New Booking
            </button>
          </div>
        </div>
      )}

      {/* Show PayPal Payment */}
      {showPayPal && (booking || sessionStorage.getItem('retryBookingId')) ? (
        <>
          {(() => {
            const bookingId = booking?.data?.id || sessionStorage.getItem('retryBookingId');
            const amount = booking?.data?.amount || pricing?.data?.amount;
            const currency = booking?.data?.currency || pricing?.data?.currency || 'AUD';
            
            // Ensure we have valid values before rendering PayPal
            if (!bookingId || !amount) {
              return <div>Loading payment details...</div>;
            }
            
            // Convert amount to number if it's a string
            const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
            
            console.log('Step4Payment: Rendering PayPal with booking data:', {
              id: bookingId,
              amount: amount,
              currency: currency
            });
            
            return (
              <PayPalPayment
                key={bookingId} // Force re-mount when booking changes
                bookingId={bookingId}
                amount={numericAmount}
                currency={currency}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onCancel={handlePaymentCancel}
              />
            );
          })()}
        </>
      ) : isProcessing ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Creating your booking...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we prepare your consultation</p>
        </div>
      ) : (
        /* Payment Details */
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-gray-600">Consultation Fee</span>
              <span className="font-semibold">
                {pricing?.data?.currency} {pricing?.data?.amount}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-gray-600">Processing Fee</span>
              <span className="font-semibold">Free</span>
            </div>
            <div className="flex justify-between items-center py-3 text-lg font-bold">
              <span>Total</span>
              <span className="text-primary-600">
                {pricing?.data?.currency} {pricing?.data?.amount}
              </span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3">Payment Method</h4>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <div>
                  <h5 className="font-semibold text-blue-900">PayPal</h5>
                  <p className="text-sm text-blue-700">Secure payment with PayPal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="btn-secondary"
          disabled={isProcessing}
        >
          Back to Notes
        </button>
        <button
          onClick={() => {
            console.log('Step4Payment: Button clicked!');
            handlePayment();
          }}
          disabled={isProcessing}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing 
            ? 'Creating Booking...' 
            : booking && booking.data && booking.data.id 
              ? 'Proceed to Payment' 
              : showPayPal 
                ? 'Try Again' 
                : 'Create Booking & Pay'
          }
        </button>
      </div>
    </div>
  );
};
