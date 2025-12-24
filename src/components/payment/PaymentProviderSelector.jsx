import React from 'react';

/**
 * Composant de sélection de provider de paiement
 * Affiche uniquement Ligdicash comme moyen de paiement avec redirection
 *
 * @param {Object} props
 * @param {Function} props.onProviderChange - Callback lors du changement de provider (provider, flowType)
 * @param {boolean} props.disabled - Désactiver la sélection
 */
const PaymentProviderSelector = ({
  onProviderChange,
  disabled = false
}) => {
  const handleClick = () => {
    if (disabled) return;
    // Toujours utiliser le flux redirect avec LIGDICASH
    onProviderChange('LIGDICASH', 'redirect');
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Moyen de paiement
      </h3>

      <div
        onClick={handleClick}
        className={`
          relative border-2 rounded-xl p-6 cursor-pointer transition-all
          border-blue-500 bg-blue-50 hover:bg-blue-100
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <img
            src="/images/ligdicash.png"
            alt="Ligdicash"
            className="h-16 object-contain"
          />
          <span className="font-medium text-gray-900 text-lg">
            Payer avec Ligdicash
          </span>
          <p className="text-sm text-gray-600 text-center">
            Paiement sécurisé via Mobile Money (Orange, MTN, Moov, Wave)
          </p>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-sm text-gray-600 text-center">
          Vous serez redirigé vers la plateforme Ligdicash pour finaliser votre paiement en toute sécurité.
        </p>
      </div>
    </div>
  );
};

export default PaymentProviderSelector;
