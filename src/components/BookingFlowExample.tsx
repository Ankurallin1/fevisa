import { useState } from 'react';
import { api } from '../lib/api';
import type { AvailabilityResponse, CreateBookingRequest } from '../lib/types/site';

/**
 * Example component demonstrating the new booking flow:
 * 1. Check availability for a date
 * 2. Select a slot
 * 3. Create booking
 */
export default function BookingFlowExample() {
  const [date, setDate] = useState('2025-12-25');
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [bookingResult, setBookingResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAvailability = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.checkAvailability(date);
      setAvailability(response);
    } catch (err: any) {
      setError(err.message || 'Failed to check availability');
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async () => {
    if (!selectedSlot) return;
    
    setLoading(true);
    setError(null);
    try {
      const bookingData: CreateBookingRequest = {
        date,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        duration: 30,
        notes: 'Visa consultation for student visa application'
      };

      const response = await api.createBooking(bookingData);
      setBookingResult(response);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Booking Flow Example</h1>
      
      {/* Step 1: Check Availability */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Step 1: Check Availability</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-field"
          />
          <button
            onClick={checkAvailability}
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Check Availability'}
          </button>
        </div>

        {availability && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Availability Results:</h3>
            <p><strong>Available:</strong> {availability.data.available ? 'Yes' : 'No'}</p>
            <p><strong>Consultant:</strong> {availability.data.consultant.name}</p>
            <p><strong>Date:</strong> {availability.data.date}</p>
            <p><strong>Timezone:</strong> {availability.data.timezone}</p>
            
            <div className="mt-4">
              <h4 className="font-medium mb-2">Available Slots:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {availability.data.slots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSlot(slot)}
                    disabled={!slot.available}
                    className={`p-2 rounded border text-sm ${
                      slot.available
                        ? selectedSlot?.startTime === slot.startTime
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-white border-gray-300 hover:bg-gray-50'
                        : 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed'
                    }`}
                  >
                    <div>{slot.startTime} - {slot.endTime}</div>
                    <div className="text-xs">
                      {slot.available ? 'Available' : 'Unavailable'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Step 2: Create Booking */}
      {selectedSlot && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Step 2: Create Booking</h2>
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-2">Selected Slot:</h3>
            <p><strong>Time:</strong> {selectedSlot.startTime} - {selectedSlot.endTime}</p>
            <p><strong>Date:</strong> {date}</p>
          </div>
          
          <button
            onClick={createBooking}
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? 'Creating Booking...' : 'Create Booking'}
          </button>
        </div>
      )}

      {/* Results */}
      {bookingResult && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Booking Result:</h2>
          <div className={`p-4 rounded-lg ${
            bookingResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <p><strong>Success:</strong> {bookingResult.success ? 'Yes' : 'No'}</p>
            {bookingResult.message && <p><strong>Message:</strong> {bookingResult.message}</p>}
            {bookingResult.data && (
              <div>
                <p><strong>Booking ID:</strong> {bookingResult.data.id}</p>
                <p><strong>Reference:</strong> {bookingResult.data.reference}</p>
                <p><strong>Status:</strong> {bookingResult.data.status}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-red-800 font-medium">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
}
