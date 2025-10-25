import { showSuccess, showError } from './toast';

export interface ApiResponse {
  success: boolean;
  message: string;
  reason?: string;
  data?: any;
}

/**
 * Handles API response and shows appropriate toast messages
 * @param response - The API response object
 * @param successTitle - Title for success toast (optional)
 * @param errorTitle - Title for error toast (optional)
 * @returns The response data or null if error
 */
export function handleApiResponse(
  response: ApiResponse,
  successTitle?: string,
  errorTitle?: string
): any {
  if (response.success) {
    // Show success message
    const title = successTitle || 'Success';
    const message = response.message || 'Operation completed successfully';
    
    showSuccess(title, message);
    
    // Log reason if available
    if (response.reason) {
      console.log('API Success Reason:', response.reason);
    }
    
    return response.data;
  } else {
    // Show error message
    const title = errorTitle || 'Error';
    const message = response.message || 'Operation failed';
    
    showError(title, message);
    
    // Log reason if available
    if (response.reason) {
      console.error('API Error Reason:', response.reason);
      showError(`${title} - Reason`, response.reason);
    }
    
    return null;
  }
}

/**
 * Handles API response without showing toast messages
 * @param response - The API response object
 * @returns Object with success status, message, reason, and data
 */
export function parseApiResponse(response: ApiResponse): {
  success: boolean;
  message: string;
  reason?: string;
  data?: any;
} {
  return {
    success: response.success,
    message: response.message,
    reason: response.reason,
    data: response.data
  };
}

/**
 * Creates a standardized error message from API response
 * @param response - The API response object
 * @returns Formatted error message
 */
export function createErrorMessage(response: ApiResponse): string {
  let message = response.message || 'An error occurred';
  
  if (response.reason) {
    message += ` (${response.reason})`;
  }
  
  return message;
}

/**
 * Creates a standardized success message from API response
 * @param response - The API response object
 * @returns Formatted success message
 */
export function createSuccessMessage(response: ApiResponse): string {
  let message = response.message || 'Operation completed successfully';
  
  if (response.reason) {
    message += ` (${response.reason})`;
  }
  
  return message;
}
