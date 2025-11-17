import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ClockIcon, EnvelopeIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const PendingApproval = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <ClockIcon className="h-16 w-16 text-yellow-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Profil en Attente d'Approbation
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Status Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              <ClockIcon className="h-5 w-5 mr-2" />
              En attente
            </span>
          </div>

          {/* User Info */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name}
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <UserCircleIcon className="h-20 w-20 text-gray-400" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-900">{user?.full_name}</h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>

          {/* Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-blue-900 mb-3">
              Votre profil photographe est en cours de vérification
            </h4>
            <p className="text-blue-800 mb-4">
              Merci de votre inscription en tant que photographe sur notre plateforme.
              Notre équipe examine actuellement votre profil pour s'assurer qu'il répond
              à nos standards de qualité.
            </p>
            <p className="text-blue-800">
              Ce processus prend généralement <strong>24 à 48 heures</strong>.
            </p>
          </div>

          {/* What's Next */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Prochaines étapes
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-600">
                    1
                  </div>
                </div>
                <p className="ml-3 text-sm text-gray-700">
                  Notre équipe vérifie votre identité et vos informations
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-600">
                    2
                  </div>
                </div>
                <p className="ml-3 text-sm text-gray-700">
                  Vous recevrez une notification par email une fois approuvé
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-600">
                    3
                  </div>
                </div>
                <p className="ml-3 text-sm text-gray-700">
                  Vous pourrez ensuite uploader et vendre vos photos
                </p>
              </li>
            </ul>
          </div>

          {/* Restrictions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h5 className="text-sm font-semibold text-yellow-900 mb-2">
              Limitations actuelles
            </h5>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Vous ne pouvez pas uploader de photos pour le moment</li>
              <li>• Les fonctionnalités de vente sont désactivées</li>
              <li>• Votre profil public n'est pas encore visible</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <EnvelopeIcon className="h-5 w-5" />
            <span>
              Des questions ? Contactez-nous à{' '}
              <a href="mailto:support@pouire.com" className="text-primary-600 hover:text-primary-700">
                support@pouire.com
              </a>
            </span>
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-center space-x-4">
            <Link
              to="/profile"
              className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Modifier mon profil
            </Link>
            <Link
              to="/"
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;
