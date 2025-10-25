import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { RescheduleBooking } from '../components/booking/RescheduleBooking';
// import { handleApiResponse } from '../lib/utils/apiResponse';
import type { BookingApi } from '../lib/types/site';

export default function Reschedule() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookingId) {
      loadBookingDetails(bookingId);
    }
  }, [bookingId]);

  const loadBookingDetails = async (id: string) => {
    try {
      console.log('Reschedule: Loading booking details for ID:', id);
      const response = await api.getBooking(id);
      console.log('Reschedule: API response:', response);
      
      if (response && response.success && response.data) {
        setBooking(response.data);
        setLoading(false);
      } else {
        console.log('Reschedule: No booking data found');
        setError('Booking not found');
        setLoading(false);
      }
    } catch (error: any) {
      console.error('Reschedule: Error loading booking:', error);
      setError('Failed to load booking details');
      setLoading(false);
    }
  };

  const handleRescheduleSuccess = () => {
    // Navigate back to the booking confirmation page
    navigate(`/booking/confirm/${bookingId}`);
  };

  const handleCancel = () => {
    // Navigate back to the booking confirmation page
    navigate(`/booking/confirm/${bookingId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Booking Details</h2>
          <p className="text-gray-600">Please wait while we load your booking information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Booking</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500 mb-8">Booking ID: {bookingId}</p>
          <div className="space-y-4">
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary"
            >
              Try Again
            </button>
            <button 
              onClick={() => navigate('/dashboard')} 
              className="btn-secondary ml-4"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h1>
          <p className="text-gray-600 mb-4">The booking you're looking for doesn't exist.</p>
          <p className="text-sm text-gray-500 mb-8">Booking ID: {bookingId}</p>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="btn-primary"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RescheduleBooking
          booking={booking}
          onRescheduleSuccess={handleRescheduleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
