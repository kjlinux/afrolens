import React from 'react';
import { AlertTriangle, X, Check } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

/**
 * ConfirmDialog - Composant de dialogue de confirmation
 * Remplace window.confirm() par une interface moderne et accessible
 *
 * @param {boolean} isOpen - Contrôle la visibilité du dialogue
 * @param {function} onClose - Callback appelé lors de la fermeture
 * @param {function} onConfirm - Callback appelé lors de la confirmation
 * @param {string} title - Titre du dialogue
 * @param {string} message - Message à afficher
 * @param {string} confirmText - Texte du bouton de confirmation (défaut: "Confirmer")
 * @param {string} cancelText - Texte du bouton d'annulation (défaut: "Annuler")
 * @param {string} variant - Variante visuelle: "danger", "warning", "info" (défaut: "warning")
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmation',
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  variant = 'warning'
}) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: AlertTriangle,
          iconColor: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          buttonVariant: 'danger'
        };
      case 'info':
        return {
          icon: Check,
          iconColor: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          buttonVariant: 'primary'
        };
      case 'warning':
      default:
        return {
          icon: AlertTriangle,
          iconColor: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          buttonVariant: 'warning'
        };
    }
  };

  const styles = getVariantStyles();
  const Icon = styles.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="small">
      <div className="p-6">
        <div className={`flex items-start gap-4 p-4 rounded-lg ${styles.bgColor} border ${styles.borderColor} mb-6`}>
          <Icon className={`w-6 h-6 ${styles.iconColor} flex-shrink-0 mt-0.5`} />
          <p className="text-gray-700 text-sm leading-relaxed">{message}</p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleConfirm}
            variant={styles.buttonVariant}
            fullWidth
          >
            {confirmText}
          </Button>
          <Button
            onClick={onClose}
            variant="ghost"
            fullWidth
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
