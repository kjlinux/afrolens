import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PHOTOGRAPHER_STATUS } from '../../utils/permissions';

/**
 * PhotographerGuard Component - Shows children only if photographer is approved
 *
 * Displays contextual messages for different photographer statuses
 *
 * @example
 * <PhotographerGuard>
 *   <UploadForm />
 * </PhotographerGuard>
 *
 * @example
 * <PhotographerGuard showStatus={false}>
 *   <PhotographerDashboard />
 * </PhotographerGuard>
 */
const PhotographerGuard = ({
  children,
  showStatus = true,
  pendingMessage,
  rejectedMessage,
  suspendedMessage,
}) => {
  const { user, hasRole, isApprovedPhotographer, getPhotographerStatus } = useAuth();

  // Not a photographer
  if (!hasRole('photographer')) {
    if (!showStatus) return null;

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Fonctionnalité Photographe
        </h3>
        <p className="text-blue-800 mb-4">
          Cette fonctionnalité est réservée aux photographes.
        </p>
        <p className="text-sm text-blue-700">
          Vous utilisez actuellement un compte {user?.account_type === 'buyer' ? 'acheteur' : user?.account_type}.
        </p>
      </div>
    );
  }

  // Photographer approved - show children
  if (isApprovedPhotographer()) {
    return <>{children}</>;
  }

  // Photographer not approved - show status message
  if (!showStatus) return null;

  const status = getPhotographerStatus();

  // Pending approval
  if (status === PHOTOGRAPHER_STATUS.PENDING) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-yellow-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">
              Profil en Attente d'Approbation
            </h3>
            <p className="text-yellow-800 mb-4">
              {pendingMessage ||
                "Votre profil photographe est en cours de vérification par notre équipe. Vous pourrez accéder à cette fonctionnalité une fois approuvé."}
            </p>
            <Link
              to="/photographer/pending"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-yellow-900 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              En savoir plus
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Rejected
  if (status === PHOTOGRAPHER_STATUS.REJECTED) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Profil Photographe Refusé
            </h3>
            <p className="text-red-800 mb-4">
              {rejectedMessage ||
                "Votre demande de profil photographe n'a pas été approuvée. Veuillez contacter le support pour plus d'informations."}
            </p>
            <div className="flex space-x-3">
              <Link
                to="/photographer/rejected"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-900 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Voir les détails
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Contacter le support
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Suspended
  if (status === PHOTOGRAPHER_STATUS.SUSPENDED) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-orange-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-lg font-semibold text-orange-900 mb-2">
              Compte Photographe Suspendu
            </h3>
            <p className="text-orange-800 mb-4">
              {suspendedMessage ||
                "Votre compte photographe a été temporairement suspendu. Veuillez contacter le support pour résoudre cette situation."}
            </p>
            <div className="flex space-x-3">
              <Link
                to="/photographer/suspended"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-orange-900 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Voir les détails
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center px-4 py-2 border border-orange-300 text-sm font-medium rounded-md text-orange-700 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Contacter le support
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Unknown status
  return null;
};

PhotographerGuard.propTypes = {
  children: PropTypes.node.isRequired,
  showStatus: PropTypes.bool,
  pendingMessage: PropTypes.string,
  rejectedMessage: PropTypes.string,
  suspendedMessage: PropTypes.string,
};

export default PhotographerGuard;
