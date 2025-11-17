import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/permissions';

/**
 * Hook to check if the current user has a specific role
 * @param {string} role - The role to check
 * @returns {boolean} - True if user has the role
 *
 * @example
 * const isAdmin = useRole('admin');
 * const isPhotographer = useRole(ROLES.PHOTOGRAPHER);
 */
export const useRole = (role) => {
  const { hasRole } = useAuth();
  return hasRole(role);
};

/**
 * Hook to check if the current user has any of the specified roles
 * @param {string[]} roles - Array of roles to check
 * @returns {boolean} - True if user has at least one role
 *
 * @example
 * const canModerateContent = useAnyRole(['moderator', 'admin']);
 */
export const useAnyRole = (roles) => {
  const { hasAnyRole } = useAuth();
  return hasAnyRole(roles);
};

/**
 * Hook to check if the current user is an admin
 * @returns {boolean} - True if user is an admin
 *
 * @example
 * const isAdmin = useIsAdmin();
 */
export const useIsAdmin = () => {
  const { hasRole } = useAuth();
  return hasRole(ROLES.ADMIN);
};

/**
 * Hook to check if the current user is a moderator
 * @returns {boolean} - True if user is a moderator
 *
 * @example
 * const isModerator = useIsModerator();
 */
export const useIsModerator = () => {
  const { hasRole } = useAuth();
  return hasRole(ROLES.MODERATOR);
};

/**
 * Hook to check if the current user is a photographer
 * @returns {boolean} - True if user is a photographer
 *
 * @example
 * const isPhotographer = useIsPhotographer();
 */
export const useIsPhotographer = () => {
  const { hasRole } = useAuth();
  return hasRole(ROLES.PHOTOGRAPHER);
};

/**
 * Hook to check if the current user is a buyer
 * @returns {boolean} - True if user is a buyer
 *
 * @example
 * const isBuyer = useIsBuyer();
 */
export const useIsBuyer = () => {
  const { hasRole } = useAuth();
  return hasRole(ROLES.BUYER);
};

export default useRole;
