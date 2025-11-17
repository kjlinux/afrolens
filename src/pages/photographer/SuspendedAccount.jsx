import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ExclamationTriangleIcon, EnvelopeIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const SuspendedAccount = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-orange-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Compte Photographe Suspendu
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Status Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
              <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
              Suspendu
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

          {/* Warning Message */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-orange-900 mb-3">
              Votre profil photographe a été temporairement suspendu
            </h4>
            <p className="text-orange-800 mb-4">
              Suite à un examen de votre compte, nous avons dû suspendre temporairement
              vos privilèges de photographe sur notre plateforme.
            </p>
            <p className="text-orange-800 font-medium">
              Cette suspension peut être due à :
            </p>
          </div>

          {/* Possible Reasons */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Raisons possibles de la suspension
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Violation des conditions d'utilisation de la plateforme</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Upload de contenu inapproprié ou de qualité insuffisante</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Plaintes multiples de la part d'acheteurs</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Non-respect des droits d'auteur</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Activité suspecte ou comportement inapproprié</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Vérification de sécurité en cours</span>
              </li>
            </ul>
          </div>

          {/* Restrictions */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-red-900 mb-3">
              Restrictions actuelles
            </h4>
            <ul className="text-sm text-red-800 space-y-2">
              <li className="flex items-start">
                <span className="mr-2">❌</span>
                <span>Vous ne pouvez pas uploader de nouvelles photos</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">❌</span>
                <span>Vos photos existantes ne sont plus visibles sur la plateforme</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">❌</span>
                <span>Les ventes sont temporairement désactivées</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">❌</span>
                <span>Vous ne pouvez pas effectuer de retraits</span>
              </li>
            </ul>
          </div>

          {/* What to Do */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-blue-900 mb-3">
              Comment résoudre cette situation ?
            </h4>
            <div className="space-y-4 text-sm text-blue-800">
              <div>
                <p className="font-medium mb-2">1. Contactez immédiatement notre support</p>
                <p className="ml-4">
                  Notre équipe vous expliquera les raisons exactes de la suspension et
                  les étapes nécessaires pour lever la suspension.
                </p>
              </div>

              <div>
                <p className="font-medium mb-2">2. Vérifiez votre email</p>
                <p className="ml-4">
                  Un email détaillant les raisons de la suspension devrait vous avoir été envoyé.
                  Vérifiez également vos spams.
                </p>
              </div>

              <div>
                <p className="font-medium mb-2">3. Suivez les instructions du support</p>
                <p className="ml-4">
                  Coopérez avec notre équipe pour résoudre les problèmes identifiés.
                  Dans la plupart des cas, la suspension peut être levée une fois les
                  problèmes résolus.
                </p>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h5 className="text-sm font-semibold text-yellow-900 mb-2">
              Informations importantes
            </h5>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Vous pouvez toujours naviguer sur la plateforme en tant qu'acheteur</li>
              <li>• Vos revenus en attente sont sécurisés et seront disponibles après levée de la suspension</li>
              <li>• La durée de la suspension dépend de la nature de la violation</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="bg-white border border-gray-300 rounded-lg p-4 mb-6">
            <h5 className="text-sm font-semibold text-gray-900 mb-3 text-center">
              Contact Support Urgent
            </h5>
            <div className="space-y-2 text-center">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-700">
                <EnvelopeIcon className="h-5 w-5" />
                <a href="mailto:support@pouire.com" className="text-primary-600 hover:text-primary-700 font-medium">
                  support@pouire.com
                </a>
              </div>
              <p className="text-xs text-gray-500">
                Temps de réponse moyen : 24-48h
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            <Link
              to="/contact"
              className="px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Contacter le support
            </Link>
            <Link
              to="/"
              className="px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuspendedAccount;
