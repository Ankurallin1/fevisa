import { clearAllSessionData } from './sessionCleanup';
import { showError } from './toast';

/**
 * Handle session expiry (401 errors)
 * Shows session expired message, clears all data, and redirects to auth page
 */
export const handleSessionExpiry = (): void => {
  console.log('SessionExpiry: Handling session expiry');
  
  // Show session expired message
  showError('Session Expired', 'Your session has expired. Please login again.');
  
  // Clear all data after 1 second
  setTimeout(() => {
    console.log('SessionExpiry: Clearing all data and redirecting to auth');
    clearAllSessionData();
    
    // Redirect to auth page
    window.location.href = '/auth';
  }, 1000);
};

/**
 * Check if an error is a 401 session expiry error
 */
export const isSessionExpiryError = (error: any): boolean => {
  return error?.response?.status === 401;
};
