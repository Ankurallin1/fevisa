import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../lib/api/authService';
import { CancelBookingModal } from './CancelBookingModal';

interface Booking {
  id: string;
  consultant: {
    _id: string;
    name: string;
    email: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  amount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  notes?: string;
  isRescheduled: boolean;
  createdAt: string;
  canBeCancelled: boolean;
  canBeCancelledByUser: boolean;
  canBeRescheduled: boolean;
}

interface CancelBookingSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CancelBookingSelectionModal: React.FC<CancelBookingSelectionModalProps> = ({ isOpen, onClose }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadCancellableBookings();
    }
  }, [isOpen]);

  const loadCancellableBookings = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load all pages to get all cancellable bookings
      const response = await bookingService.getMyBookings(undefined, 1, 100);
      
      if (response.success) {
        // Filter only cancellable bookings
        const cancellableBookings = response.data.filter(
          (booking: Booking) => booking.canBeCancelledByUser
        );
        setBookings(cancellableBookings);
      } else {
        setError('Failed to load bookings');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const handleCancelSuccess = () => {
    loadCancellableBookings(); // Reload bookings
    setShowCancelModal(false);
    setSelectedBooking(null);
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
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
          <div className="mt-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Cancel Booking</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="text-red-600 mb-4">{error}</div>
                <button
                  onClick={loadCancellableBookings}
                  className="btn-primary"
                >
                  Try Again
                </button>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Bookings to Cancel</h3>
                <p className="text-gray-600 mb-4">
                  You don't have any bookings that can be cancelled at the moment.
                </p>
                <Link
                  to="/book"
                  className="btn-primary"
                  onClick={onClose}
                >
                  Book New Appointment
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Select a booking to cancel:
                </p>
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="text-sm font-medium text-gray-900">
                            {formatDate(booking.date)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                          </div>
                          <div className="text-xs text-gray-400">
                            {booking.duration} min
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          Consultant: {booking.consultant.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          Amount: {booking.currency} {booking.amount.toFixed(2)}
                        </div>
                      </div>
                      <button
                        onClick={() => handleCancelBooking(booking)}
                        className="btn-danger text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Individual Cancel Modal */}
      {selectedBooking && (
        <CancelBookingModal
          isOpen={showCancelModal}
          onClose={() => {
            setShowCancelModal(false);
            setSelectedBooking(null);
          }}
          bookingId={selectedBooking.id}
          bookingDetails={{
            date: selectedBooking.date,
            startTime: selectedBooking.startTime,
            endTime: selectedBooking.endTime,
            consultant: selectedBooking.consultant.name,
            amount: selectedBooking.amount,
            currency: selectedBooking.currency,
          }}
          onSuccess={handleCancelSuccess}
        />
      )}
    </>
  );
};
