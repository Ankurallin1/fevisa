/**
 * Utility functions for cleaning up sessionStorage data
 */

/**
 * Clear all booking-related sessionStorage data
 */
export const clearBookingSessionData = (): void => {
  console.log('SessionCleanup: Clearing all booking-related sessionStorage data');
  
  const bookingKeys = [
    'bookingData',
    'currentBooking', 
    'bookingPricing',
    'bookingSelectedDate',
    'bookingAvailability',
    'bookingSelectedSlot',
    'bookingNotes',
    'bookingCurrentStep'
  ];
  
  bookingKeys.forEach(key => {
    sessionStorage.removeItem(key);
  });
  
  console.log('SessionCleanup: All booking sessionStorage data cleared');
};

/**
 * Clear all session and local storage data (for session expiry)
 */
export const clearAllSessionData = (): void => {
  console.log('SessionCleanup: Clearing all session and local storage data');
  
  // Clear all sessionStorage
  sessionStorage.clear();
  
  // Clear all localStorage
  localStorage.clear();
  
  console.log('SessionCleanup: All session and local storage data cleared');
};

/**
 * Clear specific booking sessionStorage data
 */
export const clearSpecificBookingData = (keys: string[]): void => {
  console.log('SessionCleanup: Clearing specific booking sessionStorage data:', keys);
  
  keys.forEach(key => {
    sessionStorage.removeItem(key);
  });
  
  console.log('SessionCleanup: Specific booking sessionStorage data cleared');
};

/**
 * Check if there's any booking data in sessionStorage
 */
export const hasBookingSessionData = (): boolean => {
  const bookingKeys = [
    'bookingData',
    'currentBooking', 
    'bookingPricing',
    'bookingSelectedDate',
    'bookingAvailability',
    'bookingSelectedSlot',
    'bookingNotes',
    'bookingCurrentStep'
  ];
  
  return bookingKeys.some(key => sessionStorage.getItem(key) !== null);
};

/**
 * Get all booking sessionStorage keys that have data
 */
export const getBookingSessionKeys = (): string[] => {
  const bookingKeys = [
    'bookingData',
    'currentBooking', 
    'bookingPricing',
    'bookingSelectedDate',
    'bookingAvailability',
    'bookingSelectedSlot',
    'bookingNotes',
    'bookingCurrentStep'
  ];
  
  return bookingKeys.filter(key => sessionStorage.getItem(key) !== null);
};
