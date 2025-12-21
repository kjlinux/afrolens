import React from 'react';
import { OTP_PROVIDERS, PROVIDER_NAMES, PROVIDER_ICONS } from '@/utils/constants';
import Badge from '@/components/common/Badge';

/**
 * Composant de sélection de provider de paiement
 * Affiche tous les providers disponibles avec indication OTP ou Redirect
 *
 * @param {Object} props
 * @param {string} props.selectedProvider - Provider actuellement sélectionné
 * @param {Function} props.onProviderChange - Callback lors du changement de provider (provider, flowType)
 * @param {boolean} props.disabled - Désactiver la sélection
 */
const PaymentProviderSelector = ({
  selectedProvider = '',
  onProviderChange,
  disabled = false
}) => {
  // Liste des providers disponibles
  const providers = ['ORANGE', 'LIGDICASH_WALLET', 'MTN', 'MOOV', 'WAVE'];

  const handleProviderClick = (provider) => {
    if (disabled) return;

    // Déterminer le type de flux
    const flowType = OTP_PROVIDERS.includes(provider) ? 'otp' : 'redirect';

    onProviderChange(provider, flowType);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Choisissez votre moyen de paiement
      </h3>

      <div className="grid grid-cols-1 gap-3">
        {providers.map((provider) => {
          const isOTP = OTP_PROVIDERS.includes(provider);
          const isSelected = selectedProvider === provider;

          return (
            <div
              key={provider}
              onClick={() => handleProviderClick(provider)}
              className={`
                relative border-2 rounded-xl p-4 cursor-pointer transition-all
                ${isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <div className="flex items-center justify-between">
                {/* Radio button + Label */}
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="payment-provider"
                    value={provider}
                    checked={isSelected}
                    onChange={() => handleProviderClick(provider)}
                    disabled={disabled}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                  />

                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{PROVIDER_ICONS[provider]}</span>
                    <span className="font-medium text-gray-900">
                      {PROVIDER_NAMES[provider]}
                    </span>
                  </div>
                </div>

                {/* Badge OTP */}
                {isOTP && (
                  <Badge variant="success" className="text-xs">
                    Paiement rapide par OTP
                  </Badge>
                )}
              </div>

              {/* Description pour les providers OTP */}
              {isOTP && (
                <p className="mt-2 text-sm text-gray-600 ml-8">
                  Recevez un code par SMS et validez votre paiement instantanément
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Note d'information */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">💡 Astuce:</span> Les paiements OTP
          (Orange Money et Ligdicash Wallet) sont plus rapides car vous restez sur
          la page sans redirection.
        </p>
      </div>
    </div>
  );
};

export default PaymentProviderSelector;
