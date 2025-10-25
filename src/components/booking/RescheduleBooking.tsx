import React, { useState, useEffect } from 'react';
import { formatDate } from '../../lib/utils/format';
import { formatTime } from '../../lib/utils/timeFormat';
import { api } from '../../lib/api';
import { handleApiResponse, createErrorMessage } from '../../lib/utils/apiResponse';
import { showSuccess, showError } from '../../lib/utils/toast';
import type { AvailabilityResponse, AvailabilitySlot, BookingApi } from '../../lib/types/site';

interface RescheduleBookingProps {
  booking: BookingApi;
  onRescheduleSuccess: () => void;
  onCancel: () => void;
}

export const RescheduleBooking: React.FC<RescheduleBookingProps> = ({
  booking,
  onRescheduleSuccess,
  onCancel,
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRescheduling, setIsRescheduling] = useState(false);

  // Initialize with current booking date and load availability
  useEffect(() => {
    const currentDate = new Date(booking.date).toISOString().split('T')[0];
    setSelectedDate(currentDate);
    // Automatically load availability for the current booking date
    handleDateChange(currentDate);
  }, [booking]);

  const handleDateChange = async (date: string) => {
    console.log('RescheduleBooking: Checking availability for date:', date);
    setSelectedDate(date);
    setSelectedSlot(null);
    setError(null);
    setLoading(true);

    try {
      const response = await api.checkAvailability(date);
      console.log('RescheduleBooking: Availability response:', response);
      setAvailability(response);
    } catch (error: any) {
      console.error('RescheduleBooking: Error checking availability:', error);
      setError(error.message || 'Failed to check availability');
    } finally {
      setLoading(false);
    }
  };

  const handleSlotSelect = (slot: AvailabilitySlot) => {
    console.log('RescheduleBooking: Slot selected:', slot);
    setSelectedSlot(slot);
  };

  const handleReschedule = async () => {
    if (!selectedSlot) {
      setError('Please select a time slot');
      return;
    }

    setIsRescheduling(true);
    setError(null);

    try {
      const rescheduleData = {
        newDate: selectedDate,
        newStartTime: selectedSlot.startTime,
        newEndTime: selectedSlot.endTime,
      };

      console.log('RescheduleBooking: Rescheduling booking with data:', rescheduleData);
      const response = await api.rescheduleBooking(booking.id, rescheduleData);
      
      const rescheduleResult = handleApiResponse(
        response,
        'Booking Rescheduled',
        'Reschedule Failed'
      );

      if (rescheduleResult) {
        showSuccess('Booking Rescheduled', 'Your consultation has been successfully rescheduled');
        onRescheduleSuccess();
      } else {
        setError(createErrorMessage(response));
      }
    } catch (error: any) {
      console.error('RescheduleBooking: Reschedule error:', error);
      const errorMessage = error.message || 'Failed to reschedule booking';
      setError(errorMessage);
      showError('Reschedule Error', errorMessage);
    } finally {
      setIsRescheduling(false);
    }
  };

  const canReschedule = selectedSlot && !isRescheduling;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Reschedule Booking</h2>
          <p className="text-gray-600 mb-6">
            Select a new date and time for your consultation. Current booking is on{' '}
            <span className="font-medium">
              {formatDate(booking.date)} at {booking.startTime} - {booking.endTime}
            </span>
          </p>
        </div>

        {/* Current Booking Info */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Booking</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">Date:</span>
              <span className="ml-2 font-medium">{formatDate(booking.date)}</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Time:</span>
              <span className="ml-2 font-medium">{booking.startTime} - {booking.endTime}</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Consultant:</span>
              <span className="ml-2 font-medium">{booking.consultant.name}</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Duration:</span>
              <span className="ml-2 font-medium">{booking.duration} minutes</span>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select New Date</h3>
          <div className="mb-4">
            <label htmlFor="reschedule-date" className="block text-sm font-medium text-gray-700 mb-2">
              Choose a new date
            </label>
            <input
              id="reschedule-date"
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Availability Loading */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Checking availability...</p>
          </div>
        )}

        {/* Availability Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Available Slots */}
        {availability && availability.data && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Time Slots</h3>
            {availability.data.slots && availability.data.slots.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {availability.data.slots.map((slot) => (
                  <button
                    key={`${slot.startTime}-${slot.endTime}`}
                    onClick={() => handleSlotSelect(slot)}
                    disabled={!slot.available}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedSlot?.startTime === slot.startTime && selectedSlot?.endTime === slot.endTime
                        ? 'border-primary-500 bg-primary-50 text-primary-900'
                        : slot.available
                        ? 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                        : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <div className="font-medium">
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {slot.available ? 'Available' : 'Unavailable'}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No available slots for this date</p>
                <p className="text-sm text-gray-500 mt-2">Please try a different date</p>
              </div>
            )}
          </div>
        )}

        {/* Selected Slot Summary */}
        {selectedSlot && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-primary-900 mb-2">Selected New Time</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-primary-700">Date:</span>
                <span className="ml-2 font-medium text-primary-900">{formatDate(selectedDate)}</span>
              </div>
              <div>
                <span className="text-sm text-primary-700">Time:</span>
                <span className="ml-2 font-medium text-primary-900">
                  {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={onCancel}
            disabled={isRescheduling}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleReschedule}
            disabled={!canReschedule}
            className={`btn-primary ${!canReschedule ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isRescheduling ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Rescheduling...
              </div>
            ) : (
              'Reschedule Booking'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
