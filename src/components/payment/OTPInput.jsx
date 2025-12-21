import React, { useState, useEffect } from 'react';
import { validateOTP } from '@/services/orderService';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import { OTP_CONFIG } from '@/utils/constants';

/**
 * Composant de saisie et validation du code OTP
 * Affiche un champ pour entrer le code à 6 chiffres avec compte à rebours
 *
 * @param {Object} props
 * @param {string} props.orderId - ID de la commande
 * @param {string} props.phoneNumber - Numéro de téléphone (pour affichage)
 * @param {string} props.expiresAt - Date d'expiration ISO 8601
 * @param {number} props.attemptsRemaining - Tentatives restantes
 * @param {Function} props.onSuccess - Callback succès avec le résultat
 * @param {Function} props.onError - Callback erreur avec le message
 * @param {Function} props.onRequestNewOTP - Callback pour redemander un OTP
 * @param {Function} props.onClose - Callback pour fermer le modal
 */
const OTPInput = ({
  orderId,
  phoneNumber,
  expiresAt,
  attemptsRemaining: initialAttempts,
  onSuccess,
  onError,
  onRequestNewOTP,
  onClose
}) => {
  const [otp, setOTP] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState(initialAttempts);

  // Calculer et mettre à jour le temps restant
  useEffect(() => {
    if (!expiresAt) return;

    const updateTimer = () => {
      const now = new Date();
      const expiryDate = new Date(expiresAt);
      const diff = Math.floor((expiryDate - now) / 1000);
      setTimeRemaining(Math.max(0, diff));
    };

    // Mise à jour initiale
    updateTimer();

    // Mise à jour chaque seconde
    const interval = setInterval(updateTimer, 1000);

    // Nettoyage
    return () => clearInterval(interval);
  }, [expiresAt]);

  // Formater le temps restant (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Gérer la saisie du code OTP (uniquement des chiffres)
  const handleOTPChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Supprimer tout sauf les chiffres
    if (value.length <= OTP_CONFIG.CODE_LENGTH) {
      setOTP(value);
    }
  };

  // Valider le code OTP
  const handleValidate = async () => {
    if (otp.length !== OTP_CONFIG.CODE_LENGTH) {
      onError('Le code OTP doit contenir 6 chiffres');
      return;
    }

    if (timeRemaining === 0) {
      onError('Le code OTP a expiré');
      return;
    }

    setLoading(true);

    try {
      const result = await validateOTP(orderId, { otp });
      onSuccess(result);
    } catch (error) {
      onError(error.message || 'Code OTP invalide');
      setOTP(''); // Réinitialiser pour nouvelle tentative
      setAttemptsRemaining(prev => Math.max(0, prev - 1));
    } finally {
      setLoading(false);
    }
  };

  // Gérer la touche Entrée
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && otp.length === OTP_CONFIG.CODE_LENGTH && timeRemaining > 0 && !loading) {
      handleValidate();
    }
  };

  const isExpired = timeRemaining === 0;
  const isLimitReached = attemptsRemaining === 0;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Entrez le code OTP
        </h3>
        <p className="text-gray-600">
          Un code à 6 chiffres a été envoyé au <strong>{phoneNumber}</strong>
        </p>
      </div>

      {/* Compte à rebours */}
      <div className="flex justify-center">
        {timeRemaining > 0 ? (
          <Badge variant="success" className="text-base px-4 py-2">
            ⏱️ Expire dans: <strong>{formatTime(timeRemaining)}</strong>
          </Badge>
        ) : (
          <Badge variant="danger" className="text-base px-4 py-2">
            ❌ Code expiré
          </Badge>
        )}
      </div>

      {/* Tentatives restantes */}
      {!isLimitReached && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Tentatives restantes: <strong className="text-blue-600">{attemptsRemaining}/{OTP_CONFIG.MAX_ATTEMPTS}</strong>
          </p>
        </div>
      )}

      {/* Limite atteinte */}
      {isLimitReached && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <span className="text-yellow-600 text-xl">⚠️</span>
            <div>
              <p className="font-semibold text-yellow-900">
                Nombre maximum de tentatives atteint
              </p>
              <p className="text-sm text-yellow-800 mt-1">
                Vous avez atteint la limite de {OTP_CONFIG.MAX_ATTEMPTS} tentatives.
                Veuillez créer une nouvelle commande ou contacter le support.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Champ de saisie OTP */}
      {!isLimitReached && (
        <div className="space-y-4">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={OTP_CONFIG.CODE_LENGTH}
            value={otp}
            onChange={handleOTPChange}
            onKeyPress={handleKeyPress}
            placeholder="000000"
            disabled={isExpired || loading}
            autoFocus
            className="w-full text-center text-4xl font-bold tracking-widest px-4 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          {/* Indicateur de progression */}
          <div className="flex justify-center space-x-2">
            {[...Array(OTP_CONFIG.CODE_LENGTH)].map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index < otp.length ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Boutons d'action */}
      <div className="space-y-3">
        {/* Bouton de validation */}
        {!isLimitReached && (
          <Button
            onClick={handleValidate}
            disabled={otp.length !== OTP_CONFIG.CODE_LENGTH || isExpired || loading}
            variant="primary"
            className="w-full py-3 text-lg"
          >
            {loading ? 'Validation en cours...' : 'Valider le paiement'}
          </Button>
        )}

        {/* Bouton pour redemander un OTP */}
        {isExpired && !isLimitReached && attemptsRemaining > 0 && (
          <Button
            onClick={onRequestNewOTP}
            variant="secondary"
            className="w-full py-3"
          >
            Demander un nouveau code
          </Button>
        )}

        {/* Bouton Annuler */}
        {!loading && (
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full py-2"
          >
            Annuler
          </Button>
        )}
      </div>

      {/* Note de sécurité */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          🔒 Ne partagez jamais votre code OTP avec qui que ce soit
        </p>
      </div>
    </div>
  );
};

export default OTPInput;
