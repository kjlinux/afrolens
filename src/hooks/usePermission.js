import { useAuth } from '../context/AuthContext';

/**
 * Hook to check if the current user has a specific permission
 * @param {string} permission - The permission to check
 * @returns {boolean} - True if user has the permission
 *
 * @example
 * const canUpload = usePermission('upload-photos');
 * if (canUpload) {
 *   // Show upload button
 * }
 */
export const usePermission = (permission) => {
  const { hasPermission } = useAuth();
  return hasPermission(permission);
};

/**
 * Hook to check if the current user has any of the specified permissions
 * @param {string[]} permissions - Array of permissions to check
 * @returns {boolean} - True if user has at least one permission
 *
 * @example
 * const canModerate = useAnyPermission(['moderate-photos', 'approve-photos']);
 */
export const useAnyPermission = (permissions) => {
  const { hasAnyPermission } = useAuth();
  return hasAnyPermission(permissions);
};

/**
 * Hook to check if the current user has all of the specified permissions
 * @param {string[]} permissions - Array of permissions to check
 * @returns {boolean} - True if user has all permissions
 *
 * @example
 * const canFullyManagePhotos = useAllPermissions(['upload-photos', 'edit-own-photos', 'delete-own-photos']);
 */
export const useAllPermissions = (permissions) => {
  const { hasAllPermissions } = useAuth();
  return hasAllPermissions(permissions);
};

export default usePermission;
