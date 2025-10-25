import { useState, useEffect } from 'react';
import type { Service, AvailabilitySlot, AvailabilityResponse } from '../lib/types/site';
import { api } from '../lib/api';
import { useHeldSlot } from '../lib/hooks/useHeldSlot';
import { formatDate } from '../lib/utils/format';

interface SlotCalendarProps {
  service: Service;
  onSlotSelect: (slot: AvailabilitySlot) => void;
  onBack: () => void;
}

export default function SlotCalendar({ service, onSlotSelect, onBack }: SlotCalendarProps) {
  const [availabilityData, setAvailabilityData] = useState<AvailabilityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { heldSlot, holdSlot, releaseSlot, timeRemaining } = useHeldSlot();

  useEffect(() => {
    // Get today's date
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    setSelectedDate(todayStr);
    checkAvailability(todayStr);
  }, [service]);

  const checkAvailability = async (date: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.checkAvailability(date);
      if (response.success) {
        setAvailabilityData(response);
      } else {
        setError('No availability found for this date');
      }
    } catch (error) {
      console.error('Failed to check availability:', error);
      setError('Failed to load availability. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSlotClick = async (slot: AvailabilitySlot) => {
    if (!slot.available) {
      return; // Don't allow selection of unavailable slots
    }

    if (heldSlot && heldSlot.startTime === slot.startTime) {
      // Already holding this slot, proceed
      onSlotSelect(slot);
      return;
    }

    if (heldSlot) {
      // Release current slot first
      await releaseSlot();
    }

    // Hold new slot (convert AvailabilitySlot to BookingSlot format for holding)
    const bookingSlot = {
      id: `${slot.startTime}-${slot.endTime}`,
      date: selectedDate,
      time: slot.startTime,
      available: slot.available,
    };
    
    const success = await holdSlot(bookingSlot);
    if (success) {
      onSlotSelect(slot);
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    checkAvailability(date);
  };

  const getAvailableSlots = () => {
    if (!availabilityData?.data?.slots) return [];
    return availabilityData.data.slots.filter(slot => slot.available);
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Checking availability...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={() => checkAvailability(selectedDate)} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  if (!availabilityData?.data?.available) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600 mb-4">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-gray-600 mb-4">No availability for {formatDate(selectedDate)}</p>
        <button onClick={onBack} className="btn-secondary">
          Back to Services
        </button>
      </div>
    );
  }

  const availableSlots = getAvailableSlots();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a Time Slot</h2>
          <p className="text-gray-600">Choose your preferred consultation time for {service.name}</p>
          {availabilityData?.data?.consultant && (
            <p className="text-sm text-gray-500 mt-1">
              Consultant: {availabilityData.data.consultant.name}
            </p>
          )}
        </div>
        <button onClick={onBack} className="btn-secondary">
          Back to Services
        </button>
      </div>

      {/* Date Navigation */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setDate(newDate.getDate() - 1);
              handleDateChange(newDate.toISOString().split('T')[0]);
            }}
            className="btn-secondary"
          >
            Previous Day
          </button>
          <h3 className="text-lg font-semibold text-gray-900">
            {formatDate(selectedDate)}
          </h3>
          <button
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setDate(newDate.getDate() + 1);
              handleDateChange(newDate.toISOString().split('T')[0]);
            }}
            className="btn-secondary"
          >
            Next Day
          </button>
        </div>
      </div>

      {/* Available Slots */}
      <div className="space-y-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">
            {formatDate(selectedDate)}
          </h4>
          {availableSlots.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableSlots.map((slot, index) => {
                const isHeld = heldSlot?.startTime === slot.startTime;
                const isSelected = heldSlot?.startTime === slot.startTime;

                return (
                  <button
                    key={`${slot.startTime}-${slot.endTime}-${index}`}
                    onClick={() => handleSlotClick(slot)}
                    disabled={isHeld && !isSelected}
                    className={`p-3 rounded-lg border text-center transition-all duration-200 ${
                      isSelected
                        ? 'bg-primary-600 text-white border-primary-600'
                        : isHeld
                        ? 'bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed'
                        : 'bg-white text-gray-900 border-gray-300 hover:border-primary-500 hover:bg-primary-50'
                    }`}
                  >
                    <div className="font-medium">{formatTime(slot.startTime)}</div>
                    <div className="text-xs text-gray-500">
                      {slot.endTime}
                    </div>
                    {isSelected && timeRemaining > 0 && (
                      <div className="text-xs mt-1">
                        Held for {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No available slots for this date</p>
          )}
        </div>
      </div>

      {heldSlot && (
        <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-primary-900">Slot Reserved</h4>
              <p className="text-sm text-primary-700">
                {formatDate(selectedDate)} at {formatTime(heldSlot.startTime || heldSlot.time)} - {timeRemaining > 0 ? `${Math.floor(timeRemaining / 60)}:${(timeRemaining % 60).toString().padStart(2, '0')} remaining` : 'Expired'}
              </p>
            </div>
            <button
              onClick={() => {
                const slot = availableSlots.find(s => s.startTime === heldSlot.startTime);
                if (slot) onSlotSelect(slot);
              }}
              className="btn-primary"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
