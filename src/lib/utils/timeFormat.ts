/**
 * Utility functions for time formatting
 */

/**
 * Format time string (HH:MM) to readable format (12-hour with AM/PM)
 * @param time - Time string in HH:MM format (e.g., "09:00", "14:30")
 * @returns Formatted time string (e.g., "9:00 AM", "2:30 PM")
 */
export const formatTime = (time: string): string => {
  if (!time || typeof time !== 'string') {
    return 'Invalid time';
  }

  // Handle different time formats
  let hours: number;
  let minutes: number;

  if (time.includes(':')) {
    const [h, m] = time.split(':').map(Number);
    hours = h;
    minutes = m || 0;
  } else {
    // If it's just a number, treat as hours
    hours = parseInt(time, 10);
    minutes = 0;
  }

  // Validate hours and minutes
  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return 'Invalid time';
  }

  // Convert to 12-hour format
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const displayMinutes = minutes.toString().padStart(2, '0');

  return `${displayHours}:${displayMinutes} ${period}`;
};

/**
 * Format time range (startTime - endTime)
 * @param startTime - Start time in HH:MM format
 * @param endTime - End time in HH:MM format
 * @returns Formatted time range string
 */
export const formatTimeRange = (startTime: string, endTime: string): string => {
  const formattedStart = formatTime(startTime);
  const formattedEnd = formatTime(endTime);
  return `${formattedStart} - ${formattedEnd}`;
};

/**
 * Parse time string to Date object for calculations
 * @param time - Time string in HH:MM format
 * @param date - Date to attach the time to (defaults to today)
 * @returns Date object with the specified time
 */
export const parseTimeToDate = (time: string, date: Date = new Date()): Date => {
  if (!time || typeof time !== 'string') {
    return new Date();
  }

  const [hours, minutes] = time.split(':').map(Number);
  
  if (isNaN(hours) || isNaN(minutes)) {
    return new Date();
  }

  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
};

/**
 * Check if a time is valid
 * @param time - Time string to validate
 * @returns True if time is valid
 */
export const isValidTime = (time: string): boolean => {
  if (!time || typeof time !== 'string') {
    return false;
  }

  const [hours, minutes] = time.split(':').map(Number);
  return !isNaN(hours) && !isNaN(minutes) && 
         hours >= 0 && hours <= 23 && 
         minutes >= 0 && minutes <= 59;
};


