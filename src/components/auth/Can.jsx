import React from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../context/AuthContext';

/**
 * Can Component - Conditional rendering based on permissions
 *
 * Shows children only if user has the required permission(s) or role(s)
 *
 * @example
 * // Check single permission
 * <Can permission="upload-photos">
 *   <UploadButton />
 * </Can>
 *
 * @example
 * // Check multiple permissions (any)
 * <Can anyPermission={['moderate-photos', 'approve-photos']}>
 *   <ModerateButton />
 * </Can>
 *
 * @example
 * // Check multiple permissions (all)
 * <Can allPermissions={['upload-photos', 'edit-own-photos']}>
 *   <ManagePhotosButton />
 * </Can>
 *
 * @example
 * // Check role
 * <Can role="admin">
 *   <AdminPanel />
 * </Can>
 *
 * @example
 * // Check if photographer is approved
 * <Can photographerApproved>
 *   <UploadButton />
 * </Can>
 *
 * @example
 * // Show fallback if user doesn't have permission
 * <Can permission="upload-photos" fallback={<UpgradeButton />}>
 *   <UploadButton />
 * </Can>
 */
const Can = ({
  children,
  permission,
  anyPermission,
  allPermissions,
  role,
  anyRole,
  photographerApproved = false,
  fallback = null,
}) => {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    isApprovedPhotographer,
  } = useAuth();

  let allowed = true;

  // Check single permission
  if (permission && !hasPermission(permission)) {
    allowed = false;
  }

  // Check any permission (at least one)
  if (anyPermission && !hasAnyPermission(anyPermission)) {
    allowed = false;
  }

  // Check all permissions (must have all)
  if (allPermissions && !hasAllPermissions(allPermissions)) {
    allowed = false;
  }

  // Check single role
  if (role && !hasRole(role)) {
    allowed = false;
  }

  // Check any role (at least one)
  if (anyRole && !hasAnyRole(anyRole)) {
    allowed = false;
  }

  // Check photographer approval
  if (photographerApproved && !isApprovedPhotographer()) {
    allowed = false;
  }

  return allowed ? <>{children}</> : fallback;
};

Can.propTypes = {
  children: PropTypes.node.isRequired,
  permission: PropTypes.string,
  anyPermission: PropTypes.arrayOf(PropTypes.string),
  allPermissions: PropTypes.arrayOf(PropTypes.string),
  role: PropTypes.string,
  anyRole: PropTypes.arrayOf(PropTypes.string),
  photographerApproved: PropTypes.bool,
  fallback: PropTypes.node,
};

export default Can;
