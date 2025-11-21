import axios from 'axios';
import { clearAuthToken } from '../config/apiConfig';

// Type for the logout callback
type LogoutCallback = () => void;
type NavigateCallback = (path: string) => void;

// Store callbacks for logout and navigation
let logoutCallback: LogoutCallback | null = null;
let navigateCallback: NavigateCallback | null = null;

// Flag to prevent multiple redirects
let isRedirecting = false;

/**
 * Setup the global axios interceptor for handling 401 errors
 * This should be called once when the app initializes
 */
export const setupAxiosInterceptor = (
  onLogout: LogoutCallback,
  onNavigate: NavigateCallback
) => {
  logoutCallback = onLogout;
  navigateCallback = onNavigate;

  // Add response interceptor
  const interceptorId = axios.interceptors.response.use(
    // Success handler - pass through
    (response) => response,

    // Error handler
    (error) => {
      // Check if this is a 401 error
      if (error.response?.status === 401) {
        handleUnauthorized();
      }

      // Re-throw the error for component-level handling if needed
      return Promise.reject(error);
    }
  );

  // Return cleanup function
  return () => {
    axios.interceptors.response.eject(interceptorId);
    logoutCallback = null;
    navigateCallback = null;
  };
};

/**
 * Handle unauthorized (401) errors
 * Clears auth state and redirects to login
 */
const handleUnauthorized = () => {
  // Prevent multiple simultaneous redirects
  if (isRedirecting) {
    return;
  }

  isRedirecting = true;

  // Clear authentication data
  clearAuthToken();

  // Call logout callback to update AuthContext state
  if (logoutCallback) {
    // Use a synchronous approach to clear state
    try {
      logoutCallback();
    } catch (error) {
      console.error('Error during logout callback:', error);
    }
  }

  // Navigate to login page
  if (navigateCallback) {
    navigateCallback('/login');
  }

  // Reset the flag after a short delay to allow for new requests
  setTimeout(() => {
    isRedirecting = false;
  }, 1000);
};

/**
 * Check if we're currently handling a redirect
 */
export const isHandlingRedirect = () => isRedirecting;

export default setupAxiosInterceptor;
