import React, { useState, useEffect } from 'react';
import { formatDate } from '../../lib/utils/format';
import { formatTime } from '../../lib/utils/timeFormat';
import type { AvailabilityResponse, AvailabilitySlot } from '../../lib/types/site';

interface Step2DateSelectionProps {
  selectedDate: string;
  availability: AvailabilityResponse | null;
  loading: boolean;
  error: string | null;
  selectedSlot: AvailabilitySlot | null;
  onDateSelect: (date: string) => void;
  onSlotSelect: (slot: AvailabilitySlot) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step2DateSelection: React.FC<Step2DateSelectionProps> = ({
  selectedDate,
  availability,
  loading,
  error,
  selectedSlot,
  onDateSelect,
  onSlotSelect,
  onNext,
  onBack,
}) => {
  const [localSelectedDate, setLocalSelectedDate] = useState(selectedDate || new Date().toISOString().split('T')[0]);

  // Sync local state with prop changes
  useEffect(() => {
    setLocalSelectedDate(selectedDate);
  }, [selectedDate]);

  // Check availability when component mounts if we have a date
  useEffect(() => {
    if (localSelectedDate && !availability && !loading) {
      console.log('Step2DateSelection: Auto-checking availability on mount for date:', localSelectedDate);
      onDateSelect(localSelectedDate);
    }
  }, [localSelectedDate, availability, loading, onDateSelect]);

  const handleDateChange = (date: string) => {
    console.log('Step2DateSelection: handleDateChange called with date:', date);
    console.log('Step2DateSelection: current selectedDate:', selectedDate);
    setLocalSelectedDate(date);
    // Only call onDateSelect if the date has actually changed
    if (date !== selectedDate) {
      console.log('Step2DateSelection: Date changed, calling onDateSelect');
      onDateSelect(date);
    } else {
      console.log('Step2DateSelection: Date unchanged, skipping onDateSelect');
    }
  };


  const getAvailableSlots = () => {
    if (!availability?.data?.slots) return [];
    return availability.data.slots.filter(slot => slot.available);
  };

  const getNextAvailableDate = () => {
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      if (dateStr !== selectedDate) {
        return dateStr;
      }
    }
    return '';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Select Date & Time</h2>
        <p className="text-gray-600">
          Choose your preferred consultation date and time slot
        </p>
      </div>

      {/* Date Selection */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Select Date</h3>
        <div className="flex items-center space-x-4">
          <input
            type="date"
            value={localSelectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            max={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // 90 days from now
            className="input-field flex-1"
          />
          <button
            onClick={() => handleDateChange(getNextAvailableDate())}
            className="btn-secondary"
          >
            Next Available
          </button>
        </div>
      </div>

      {/* Availability Status */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking availability...</p>
          <p className="text-sm text-gray-500 mt-2">Fetching slots and consultant information</p>
        </div>
      )}

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


      {/* Consultant Info */}
      {availability?.data?.consultant && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-blue-600 font-bold text-lg">
                  {availability.data.consultant.name.charAt(0)}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-blue-900 text-lg">{availability.data.consultant.name}</h4>
                <p className="text-sm text-blue-700">Your consultation expert</p>
                <p className="text-xs text-blue-600 mt-1">{availability.data.consultant.email}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-700">Timezone</p>
              <p className="font-semibold text-blue-900">{availability.data.timezone}</p>
            </div>
          </div>
        </div>
      )}

      {/* Available Slots */}
      {availability?.data?.available && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Available Time Slots - {formatDate(selectedDate)}
          </h3>
          
          {getAvailableSlots().length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {getAvailableSlots().map((slot, index) => {
                const isSelected = selectedSlot && 
                  selectedSlot.startTime === slot.startTime && 
                  selectedSlot.endTime === slot.endTime;
                
                return (
                  <button
                    key={index}
                    onClick={() => onSlotSelect(slot)}
                    className={`p-4 border rounded-lg transition-all duration-200 text-center ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50 text-primary-700 ring-2 ring-primary-200'
                        : 'border-gray-300 hover:border-primary-500 hover:bg-primary-50 text-gray-900'
                    }`}
                  >
                    <div className="font-medium">
                      {formatTime(slot.startTime)}
                    </div>
                    <div className="text-sm opacity-75">
                      {formatTime(slot.endTime)}
                    </div>
                    {isSelected && (
                      <div className="mt-1">
                        <svg className="w-4 h-4 mx-auto text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-600">No available slots for this date</p>
              <p className="text-sm text-gray-500 mt-2">Please try a different date</p>
            </div>
          )}
        </div>
      )}

      {!availability?.data?.available && !loading && !error && (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-600">No availability for {formatDate(selectedDate)}</p>
          <p className="text-sm text-gray-500 mt-2">Please select a different date</p>
        </div>
      )}

      {/* Selection Status */}
      {selectedSlot && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-800 font-medium">
              Selected: {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}
            </span>
          </div>
        </div>
      )}

      {!selectedSlot && availability?.data?.available && getAvailableSlots().length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-yellow-800">Please select a time slot to continue</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="btn-secondary"
        >
          Back to Pricing
        </button>
        <button
          onClick={onNext}
          disabled={!availability?.data?.available || getAvailableSlots().length === 0 || !selectedSlot}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Notes
        </button>
      </div>
    </div>
  );
};
