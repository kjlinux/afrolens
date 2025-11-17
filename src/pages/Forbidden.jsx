import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldExclamationIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const Forbidden = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <ShieldExclamationIcon className="h-24 w-24 text-red-500" />
        </div>
        <h1 className="mt-6 text-center text-6xl font-bold text-gray-900">
          403
        </h1>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
          Accès Interdit
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Explanation */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-red-900 mb-3">
              Pourquoi cette restriction ?
            </h3>
            <p className="text-red-800 mb-4">
              Cette page ou cette action nécessite des permissions spécifiques
              que votre compte ne possède pas actuellement.
            </p>

            {user && (
              <div className="mt-4 p-4 bg-white rounded border border-red-200">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Compte connecté :</span> {user.email}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  <span className="font-medium">Type de compte :</span>{' '}
                  {user.account_type === 'buyer' && 'Acheteur'}
                  {user.account_type === 'photographer' && 'Photographe'}
                  {user.account_type === 'moderator' && 'Modérateur'}
                  {user.account_type === 'admin' && 'Administrateur'}
                </p>
                {user.account_type === 'photographer' && user.photographer_status && (
                  <p className="text-sm text-gray-700 mt-1">
                    <span className="font-medium">Statut photographe :</span>{' '}
                    {user.photographer_status === 'pending' && (
                      <span className="text-yellow-600">En attente d'approbation</span>
                    )}
                    {user.photographer_status === 'approved' && (
                      <span className="text-green-600">Approuvé</span>
                    )}
                    {user.photographer_status === 'rejected' && (
                      <span className="text-red-600">Refusé</span>
                    )}
                    {user.photographer_status === 'suspended' && (
                      <span className="text-orange-600">Suspendu</span>
                    )}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Possible Solutions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              Solutions possibles
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              {user?.account_type === 'photographer' && user?.photographer_status === 'pending' && (
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    <strong>Photographes en attente :</strong> Votre profil doit être approuvé par un administrateur
                    avant d'accéder aux fonctionnalités de photographe.
                  </span>
                </li>
              )}
              {user?.account_type === 'buyer' && (
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Cette fonctionnalité est réservée aux photographes ou administrateurs.
                    Si vous souhaitez vendre des photos, créez un compte photographe.
                  </span>
                </li>
              )}
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Vérifiez que vous êtes connecté avec le bon compte
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Contactez le support si vous pensez qu'il s'agit d'une erreur
                </span>
              </li>
            </ul>
          </div>

          {/* Common Restricted Features */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Fonctionnalités généralement restreintes :
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p className="font-medium mb-2">Photographes uniquement :</p>
                <ul className="space-y-1 text-xs">
                  <li>• Upload de photos</li>
                  <li>• Gestion du portfolio</li>
                  <li>• Revenus et retraits</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-2">Administrateurs uniquement :</p>
                <ul className="space-y-1 text-xs">
                  <li>• Gestion des utilisateurs</li>
                  <li>• Modération de contenu</li>
                  <li>• Approbation des photographes</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center justify-center px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Retour
            </button>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Accueil
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Contacter le support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
