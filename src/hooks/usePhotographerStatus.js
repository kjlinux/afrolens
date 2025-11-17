import { useAuth } from '../context/AuthContext';
import { PHOTOGRAPHER_STATUS } from '../utils/permissions';

/**
 * Hook to check if the current user is an approved photographer
 * @returns {boolean} - True if user is an approved photographer
 *
 * @example
 * const isApproved = useIsApprovedPhotographer();
 * if (!isApproved) {
 *   // Show pending approval message
 * }
 */
export const useIsApprovedPhotographer = () => {
  const { isApprovedPhotographer } = useAuth();
  return isApprovedPhotographer();
};

/**
 * Hook to get the current photographer status
 * @returns {string|null} - Photographer status or null
 *
 * @example
 * const status = usePhotographerStatus();
 * if (status === 'pending') {
 *   // Show pending message
 * }
 */
export const usePhotographerStatus = () => {
  const { getPhotographerStatus } = useAuth();
  return getPhotographerStatus();
};

/**
 * Hook to check if photographer is pending approval
 * @returns {boolean} - True if photographer status is pending
 */
export const useIsPhotographerPending = () => {
  const { getPhotographerStatus } = useAuth();
  return getPhotographerStatus() === PHOTOGRAPHER_STATUS.PENDING;
};

/**
 * Hook to check if photographer is rejected
 * @returns {boolean} - True if photographer status is rejected
 */
export const useIsPhotographerRejected = () => {
  const { getPhotographerStatus } = useAuth();
  return getPhotographerStatus() === PHOTOGRAPHER_STATUS.REJECTED;
};

/**
 * Hook to check if photographer is suspended
 * @returns {boolean} - True if photographer status is suspended
 */
export const useIsPhotographerSuspended = () => {
  const { getPhotographerStatus } = useAuth();
  return getPhotographerStatus() === PHOTOGRAPHER_STATUS.SUSPENDED;
};

/**
 * Hook to check if user can upload photos (photographer + approved)
 * @returns {boolean} - True if user can upload photos
 *
 * @example
 * const canUpload = useCanUploadPhotos();
 */
export const useCanUploadPhotos = () => {
  const { canUploadPhotos } = useAuth();
  return canUploadPhotos();
};

/**
 * Hook to get all photographer-related status information
 * @returns {Object} - Object with all photographer status info
 *
 * @example
 * const { isApproved, status, canUpload, isPending, isRejected, isSuspended } = usePhotographerInfo();
 */
export const usePhotographerInfo = () => {
  const { isApprovedPhotographer, getPhotographerStatus, canUploadPhotos } = useAuth();
  const status = getPhotographerStatus();

  return {
    isApproved: isApprovedPhotographer(),
    status,
    canUpload: canUploadPhotos(),
    isPending: status === PHOTOGRAPHER_STATUS.PENDING,
    isRejected: status === PHOTOGRAPHER_STATUS.REJECTED,
    isSuspended: status === PHOTOGRAPHER_STATUS.SUSPENDED,
  };
};

export default usePhotographerStatus;
