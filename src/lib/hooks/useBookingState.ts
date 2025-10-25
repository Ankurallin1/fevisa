import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api';
import { showError, showSuccess } from '../utils/toast';
import { handleApiResponse, createErrorMessage } from '../utils/apiResponse';
import type { PricingResponse, AvailabilityResponse, AvailabilitySlot } from '../types/site';

export interface BookingState {
  // Step 1: Plan & Pricing
  pricing: PricingResponse | null;
  pricingLoading: boolean;
  pricingError: string | null;
  
  // Step 2: Date & Availability
  selectedDate: string;
  availability: AvailabilityResponse | null;
  availabilityLoading: boolean;
  availabilityError: string | null;
  
  // Step 3: Slot Selection
  selectedSlot: AvailabilitySlot | null;
  
  // Step 4: Notes & Payment
  notes: string;
  
  // General
  currentStep: number;
  isLoading: boolean;
  error: string | null;
}

export const useBookingState = () => {
  const { isAuthenticated } = useAuth();
  const lastCheckedDate = useRef<string>('');
  const [state, setState] = useState<BookingState>(() => {
    // Try to restore booking state from session storage
    const savedBookingData = sessionStorage.getItem('bookingData');
    if (savedBookingData) {
      try {
        const parsedData = JSON.parse(savedBookingData);
        return {
          pricing: parsedData.pricing || null,
          pricingLoading: false,
          pricingError: null,
          selectedDate: parsedData.selectedDate || '',
          availability: parsedData.availability || null,
          availabilityLoading: false,
          availabilityError: null,
          selectedSlot: parsedData.selectedSlot || null,
          notes: parsedData.notes || '',
          currentStep: parsedData.step || 1,
          isLoading: false,
          error: null,
        };
      } catch (error) {
        console.error('Failed to parse saved booking data:', error);
        sessionStorage.removeItem('bookingData');
      }
    }
    
    return {
      pricing: null,
      pricingLoading: false,
      pricingError: null,
      selectedDate: '',
      availability: null,
      availabilityLoading: false,
      availabilityError: null,
      selectedSlot: null,
      notes: '',
      currentStep: 1,
      isLoading: false,
      error: null,
    };
  });

  // Load pricing on mount
  useEffect(() => {
    loadPricing();
  }, []);

  const loadPricing = useCallback(async () => {
    setState(prev => ({ ...prev, pricingLoading: true, pricingError: null }));
    try {
      const response = await api.getPricing();
      
      // Handle API response with proper message display
      const pricingData = handleApiResponse(
        response,
        'Pricing Loaded',
        'Pricing Error'
      );
      
      if (pricingData) {
        setState(prev => ({ 
          ...prev, 
          pricing: response, 
          pricingLoading: false,
          pricingError: null 
        }));
      } else {
        const errorMessage = createErrorMessage(response);
        setState(prev => ({ 
          ...prev, 
          pricingLoading: false, 
          pricingError: errorMessage 
        }));
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to load pricing';
      setState(prev => ({ 
        ...prev, 
        pricingLoading: false, 
        pricingError: errorMessage 
      }));
      showError('Pricing Error', errorMessage);
    }
  }, []);

  const checkAvailability = useCallback(async (date: string) => {
    console.log('useBookingState: checkAvailability called with date:', date);
    
    // Validate date format
    if (!date || !date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const errorMessage = 'Invalid date format';
      setState(prev => ({ 
        ...prev, 
        availabilityLoading: false, 
        availabilityError: errorMessage 
      }));
      showError('Invalid Date', errorMessage);
      return;
    }

    // Don't fetch if we already checked this date and we're not loading
    if (lastCheckedDate.current === date && !state.availabilityLoading) {
      console.log('useBookingState: Already checked this date, skipping');
      return;
    }

    console.log('useBookingState: Fetching availability for date:', date);
    lastCheckedDate.current = date;
    setState(prev => ({ 
      ...prev, 
      selectedDate: date,
      selectedSlot: null, // Clear selected slot when date changes
      availabilityLoading: true, 
      availabilityError: null 
    }));
    
    try {
      console.log('useBookingState: Calling api.checkAvailability');
      const response = await api.checkAvailability(date);
      console.log('useBookingState: Received response:', response);
      
      // Handle API response with proper message display
      const availabilityData = handleApiResponse(
        response,
        'Availability Loaded',
        'Availability Error'
      );
      
      if (availabilityData) {
        setState(prev => ({ 
          ...prev, 
          availability: response, 
          availabilityLoading: false,
          availabilityError: null 
        }));
        
        // Show additional success message if slots are available
        if (response.data?.available && response.data.slots?.length > 0) {
          showSuccess('Slots Found', `Found ${response.data.slots.length} available slots`);
        }
      } else {
        const errorMessage = createErrorMessage(response);
        setState(prev => ({ 
          ...prev, 
          availabilityLoading: false, 
          availabilityError: errorMessage 
        }));
      }
    } catch (error: any) {
      console.error('useBookingState: Error fetching availability:', error);
      const errorMessage = error.message || 'Failed to check availability';
      setState(prev => ({ 
        ...prev, 
        availabilityLoading: false, 
        availabilityError: errorMessage 
      }));
      showError('Availability Error', errorMessage);
    }
  }, []);

  const selectSlot = useCallback((slot: AvailabilitySlot) => {
    setState(prev => {
      const newState = { ...prev, selectedSlot: slot };
      saveBookingState(newState);
      return newState;
    });
  }, []);

  const updateNotes = useCallback((notes: string) => {
    setState(prev => {
      const newState = { ...prev, notes };
      saveBookingState(newState);
      return newState;
    });
  }, []);

  const nextStep = () => {
    setState(prev => {
      const newState = { ...prev, currentStep: Math.min(prev.currentStep + 1, 4) };
      saveBookingState(newState);
      return newState;
    });
  };

  const prevStep = () => {
    setState(prev => {
      const newState = { ...prev, currentStep: Math.max(prev.currentStep - 1, 1) };
      saveBookingState(newState);
      return newState;
    });
  };

  const goToStep = (step: number) => {
    setState(prev => {
      const newState = { ...prev, currentStep: Math.max(1, Math.min(step, 4)) };
      saveBookingState(newState);
      return newState;
    });
  };

  const saveBookingState = (state: BookingState) => {
    const bookingData = {
      pricing: state.pricing,
      selectedDate: state.selectedDate,
      availability: state.availability,
      selectedSlot: state.selectedSlot,
      notes: state.notes,
      step: state.currentStep,
    };
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
  };

  const resetBooking = () => {
    const newState = {
      pricing: null,
      pricingLoading: false,
      pricingError: null,
      selectedDate: '',
      availability: null,
      availabilityLoading: false,
      availabilityError: null,
      selectedSlot: null,
      notes: '',
      currentStep: 1,
      isLoading: false,
      error: null,
    };
    setState(newState);
    sessionStorage.removeItem('bookingData');
  };

  const canProceedToStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!state.pricing;
      case 2:
        return !!state.pricing && !!state.availability;
      case 3:
        return !!state.pricing && !!state.availability && !!state.selectedSlot;
      case 4:
        return !!state.pricing && !!state.availability && !!state.selectedSlot;
      default:
        return false;
    }
  };

  const getStepTitle = (step: number): string => {
    switch (step) {
      case 1:
        return 'Select Plan & Pricing';
      case 2:
        return 'Choose Date & Time';
      case 3:
        return 'Add Notes';
      case 4:
        return 'Payment';
      default:
        return '';
    }
  };

  const getStepDescription = (step: number): string => {
    switch (step) {
      case 1:
        return 'Review the consultation plan and pricing';
      case 2:
        return 'Select your preferred date and time slot';
      case 3:
        return 'Add any additional notes for your consultation';
      case 4:
        return 'Complete your booking with payment';
      default:
        return '';
    }
  };

  return {
    ...state,
    isAuthenticated,
    loadPricing,
    checkAvailability,
    selectSlot,
    updateNotes,
    nextStep,
    prevStep,
    goToStep,
    resetBooking,
    canProceedToStep,
    getStepTitle,
    getStepDescription,
  };
};
