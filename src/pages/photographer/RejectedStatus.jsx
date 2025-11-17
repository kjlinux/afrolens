import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { XCircleIcon, EnvelopeIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const RejectedStatus = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <XCircleIcon className="h-16 w-16 text-red-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Profil Photographe Refusé
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Status Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-800">
              <XCircleIcon className="h-5 w-5 mr-2" />
              Refusé
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-red-900 mb-3">
              Votre demande de profil photographe n'a pas été approuvée
            </h4>
            <p className="text-red-800 mb-4">
              Après examen de votre profil, nous ne pouvons malheureusement pas approuver
              votre demande pour devenir photographe sur notre plateforme à ce stade.
            </p>
          </div>

          {/* Possible Reasons */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Raisons possibles du refus
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Informations de profil incomplètes ou inexactes</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Documents de vérification manquants ou invalides</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Non-conformité avec nos conditions d'utilisation</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Qualité du portfolio insuffisante</span>
              </li>
            </ul>
          </div>

          {/* What You Can Do */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-blue-900 mb-3">
              Que pouvez-vous faire ?
            </h4>
            <div className="space-y-3 text-sm text-blue-800">
              <p className="font-medium">
                1. Améliorez votre profil
              </p>
              <p className="ml-4">
                Assurez-vous que toutes les informations sont complètes, exactes et à jour.
              </p>

              <p className="font-medium mt-4">
                2. Contactez notre support
              </p>
              <p className="ml-4">
                Notre équipe peut vous fournir plus de détails sur les raisons du refus
                et vous guider sur les améliorations nécessaires.
              </p>

              <p className="font-medium mt-4">
                3. Soumettez à nouveau votre demande
              </p>
              <p className="ml-4">
                Une fois les problèmes corrigés, vous pourrez soumettre une nouvelle demande.
              </p>
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h5 className="text-sm font-semibold text-yellow-900 mb-2">
              Statut actuel de votre compte
            </h5>
            <p className="text-sm text-yellow-800">
              Vous pouvez toujours utiliser la plateforme en tant qu'acheteur et parcourir
              les photos disponibles. Seules les fonctionnalités de photographe sont désactivées.
            </p>
          </div>

          {/* Contact */}
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-6">
            <EnvelopeIcon className="h-5 w-5" />
            <span>
              Support :{' '}
              <a href="mailto:support@pouire.com" className="text-primary-600 hover:text-primary-700">
                support@pouire.com
              </a>
            </span>
          </div>

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            <Link
              to="/contact"
              className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Contacter le support
            </Link>
            <Link
              to="/profile"
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Modifier mon profil
            </Link>
            <Link
              to="/"
              className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectedStatus;
