import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../lib/api/authService';

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

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({ isOpen, onClose }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadReschedulableBookings();
    }
  }, [isOpen]);

  const loadReschedulableBookings = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load all pages to get all reschedulable bookings
      const response = await bookingService.getMyBookings(undefined, 1, 100);
      
      if (response.success) {
        // Filter only reschedulable bookings
        const reschedulableBookings = response.data.filter(
          (booking: Booking) => booking.canBeRescheduled
        );
        setBookings(reschedulableBookings);
      } else {
        setError('Failed to load bookings');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
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
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Reschedule Booking</h3>
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
                onClick={loadReschedulableBookings}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Bookings to Reschedule</h3>
              <p className="text-gray-600 mb-4">
                You don't have any bookings that can be rescheduled at the moment.
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
                Select a booking to reschedule:
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
                    <Link
                      to={`/booking/reschedule/${booking.id}`}
                      className="btn-primary text-sm"
                      onClick={onClose}
                    >
                      Reschedule
                    </Link>
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
  );
};