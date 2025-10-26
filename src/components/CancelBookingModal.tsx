import React, { useState } from 'react';
import { api } from '../lib/api';
import { handleApiResponse, createErrorMessage } from '../lib/utils/apiResponse';
import { showSuccess, showError } from '../lib/utils/toast';

interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  bookingDetails: {
    date: string;
    startTime: string;
    endTime: string;
    consultant: string;
    amount: number;
    currency: string;
  };
  onSuccess: () => void;
}

export const CancelBookingModal: React.FC<CancelBookingModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  bookingDetails,
  onSuccess,
}) => {
  const [reason, setReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = async () => {
    if (!reason.trim()) {
      setError('Please provide a reason for cancellation');
      return;
    }

    setIsCancelling(true);
    setError(null);

    try {
      const response = await api.cancelBookingWithRefund(bookingId, reason.trim());
      
      const cancelResult = handleApiResponse(
        response,
        'Booking Cancelled',
        'Cancellation Failed'
      );

      if (cancelResult) {
        showSuccess('Booking Cancelled', 'Your booking has been cancelled and refund will be processed');
        onSuccess();
        onClose();
      } else {
        setError(createErrorMessage(response));
      }
    } catch (error: any) {
      console.error('CancelBookingModal: Cancel error:', error);
      
      // Extract the actual error message from the API response
      let errorMessage = 'Failed to cancel booking';
      
      if (error.response?.data?.message) {
        // Use the message from the API response
        errorMessage = error.response.data.message;
      } else if (error.message) {
        // Fallback to the error message
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      showError('Cancellation Error', errorMessage);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleClose = () => {
    setReason('');
    setError(null);
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Cancel Booking</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Booking Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Booking Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Date:</span>
                <span className="ml-2 font-medium">{formatDate(bookingDetails.date)}</span>
              </div>
              <div>
                <span className="text-gray-600">Time:</span>
                <span className="ml-2 font-medium">
                  {formatTime(bookingDetails.startTime)} - {formatTime(bookingDetails.endTime)}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Consultant:</span>
                <span className="ml-2 font-medium">{bookingDetails.consultant}</span>
              </div>
              <div>
                <span className="text-gray-600">Amount:</span>
                <span className="ml-2 font-medium">
                  {bookingDetails.currency} {bookingDetails.amount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Refund Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Refund Information
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Your booking will be cancelled and a full refund will be processed. 
                    The refund will be credited to your original payment method within 3-5 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cancellation Reason */}
          <div className="mb-6">
            <label htmlFor="cancel-reason" className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Cancellation <span className="text-red-500">*</span>
            </label>
            <textarea
              id="cancel-reason"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a reason for cancelling this booking..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleClose}
              disabled={isCancelling}
              className="btn-secondary"
            >
              Keep Booking
            </button>
            <button
              onClick={handleCancel}
              disabled={isCancelling || !reason.trim()}
              className="btn-danger"
            >
              {isCancelling ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Cancelling...
                </div>
              ) : (
                'Cancel Booking'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
