// src/utils/dateUtils.ts

/**
 * Checks if a JavaScript Date object is valid.
 * @param date - A Date object to validate.
 * @returns True if valid, false otherwise.
 */
const isValidDate = (date: Date): boolean => !isNaN(date.getTime());

/**
 * Formats a date string into a readable format like "May 21, 2025".
 * @param dateString - The raw date string to format.
 * @param showTime - Whether to include the time in the formatted output.
 * @returns A formatted date string, or 'Unknown date' if invalid.
 */
export const formatDate = (dateString: string, showTime = false): string => {
  // Guard against null, undefined, or non-string input
  if (!dateString || typeof dateString !== 'string') {
    console.warn('formatDate called with invalid or missing input:', dateString);
    return 'Unknown date';
  }

  const date = new Date(dateString);

  // Validate date
  if (!isValidDate(date)) {
    console.warn('formatDate received an invalid date:', dateString);
    return 'Unknown date';
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(showTime && {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };

  return new Intl.DateTimeFormat('en-US', options).format(date);
};

/**
 * Returns a human-readable relative time string like "2 hours ago".
 * Falls back to formatted date if the input is too old or invalid.
 * @param dateString - The raw date string to compare with current time.
 * @returns A relative time string, or a formatted date if older than ~30 days.
 */
export const getRelativeTime = (dateString: string): string => {
  // Guard against null or invalid input
  if (!dateString || typeof dateString !== 'string') {
    console.warn('getRelativeTime called with invalid or missing input:', dateString);
    return 'Unknown date';
  }

  const date = new Date(dateString);

  if (!isValidDate(date)) {
    console.warn('getRelativeTime received an invalid date:', dateString);
    return 'Unknown date';
  }

  const now = new Date();
  const secondsDiff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (secondsDiff < 60) return 'just now';

  if (secondsDiff < 3600) {
    const minutes = Math.floor(secondsDiff / 60);
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  }

  if (secondsDiff < 86400) {
    const hours = Math.floor(secondsDiff / 3600);
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }

  if (secondsDiff < 2592000) { // ~30 days
    const days = Math.floor(secondsDiff / 86400);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }

  // If older than ~30 days, show formatted date
  return formatDate(dateString);
};

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  

  if (seconds < 60) {
    return 'Just now';
  }
  

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  }
  

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }
  

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}