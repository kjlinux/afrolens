import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { createOrder, initiatePayment } from '../../services/orderService';
import { formatPrice } from '../../utils/helpers';
import { useS3Image } from '../../hooks/useS3Image';
import { FiCheck } from 'react-icons/fi';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import PhoneInput from '../../components/common/PhoneInput';
import Modal from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';
import ImageWatermark from '../../components/photos/ImageWatermark';
import PaymentProviderSelector from '../../components/payment/PaymentProviderSelector';

// Helper component for cart item images
const CartItemImage = ({ item }) => {
  const { imageUrl, loading, handleImageError } = useS3Image({
    resourceId: item.photo_id || item.id,
    resourceType: 'photo',
    urlType: 'preview',
    initialUrl: item.preview_url,
  });

  if (loading) {
    return (
      <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
        <Spinner size="sm" />
      </div>
    );
  }

  return (
    <img
      src={imageUrl || item.preview_url}
      alt={item.title}
      className="w-full h-full rounded object-cover"
      onContextMenu={(e) => e.preventDefault()}
      onError={handleImageError}
      draggable={false}
    />
  );
};

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, loading, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const isMountedRef = useRef(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const [billingInfo, setBillingInfo] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  // Marquer le composant comme monté
  useEffect(() => {
    isMountedRef.current = true;
  }, []);

  // Rediriger si panier vide (uniquement après le chargement initial)
  useEffect(() => {
    if (isMountedRef.current && !loading && cart.length === 0) {
      navigate('/cart');
    }
  }, [loading, cart.length, navigate]);

  const handleBillingChange = (e) => {
    setBillingInfo({ ...billingInfo, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (phoneValue) => {
    setBillingInfo({ ...billingInfo, phone: phoneValue });
  };


  const handleSubmitBilling = (e) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handleProviderChange = () => {
    setPaymentMethod('mobile_money');
    setCurrentStep(3);
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    setShowPaymentModal(true);
    setProcessing(true);

    try {
      // Calculer les totaux
      const total = getTotal();
      const subtotal = total;

      // Préparer les données de commande
      const orderData = {
        items: cart.map(item => ({
          photo_id: item.photo_id,
          license_type: item.license_type || 'standard',
        })),
        subtotal: subtotal,
        tax: 0,
        discount: 0,
        total: total,
        payment_method: paymentMethod,
        billing_first_name: billingInfo.firstName,
        billing_last_name: billingInfo.lastName,
        billing_email: billingInfo.email,
        billing_phone: billingInfo.phone,
      };

      // Créer la commande d'abord
      const order = await createOrder(orderData);
      setOrderId(order.id);

      // Initier le paiement avec redirection Ligdicash
      await handleRedirectPayment(order.id);
    } catch (error) {
      console.error('Erreur paiement:', error);

      // Extraire le message d'erreur détaillé
      let errorMessage = 'Une erreur est survenue. Veuillez réessayer.';

      if (error.message) {
        errorMessage = error.message;
      }

      // Afficher des messages d'erreur plus spécifiques
      if (errorMessage.includes('photo')) {
        errorMessage = 'Une ou plusieurs photos du panier ne sont plus disponibles. Veuillez actualiser votre panier.';
      } else if (errorMessage.includes('fournisseur') || errorMessage.includes('provider')) {
        errorMessage = 'Le fournisseur de paiement sélectionné n\'est pas disponible. Veuillez en choisir un autre.';
      }

      toast.error(errorMessage);
      setShowPaymentModal(false);
    } finally {
      setProcessing(false);
    }
  };

  // Paiement avec redirection Ligdicash
  const handleRedirectPayment = async (orderId) => {
    try {
      const paymentData = {
        payment_method: 'mobile_money',
        payment_provider: 'LIGDICASH',
        phone: billingInfo.phone
      };

      const response = await initiatePayment(orderId, paymentData);

      if (response.payment_url) {
        // Rediriger vers la page de paiement Ligdicash
        window.location.href = response.payment_url;
      }
    } catch (error) {
      toast.error(error.message || 'Erreur lors de l\'initiation du paiement');
      throw error;
    }
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    if (paymentSuccess) {
      navigate('/orders');
    }
  };

  const steps = [
    { number: 1, title: 'Facturation', icon: '📝' },
    { number: 2, title: 'Paiement', icon: '💳' },
    { number: 3, title: 'Confirmation', icon: '✅' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Finaliser la commande</h1>

        {/* Steps */}
        <div className="mb-8 flex items-center justify-center">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${
                    currentStep > step.number
                      ? 'bg-green-500 text-white'
                      : currentStep === step.number
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {currentStep > step.number ? (
                    <FiCheck className="w-6 h-6" />
                  ) : (
                    step.icon
                  )}
                </div>
                <p
                  className={`text-sm font-medium mt-2 ${
                    currentStep > step.number
                      ? 'text-green-600'
                      : currentStep === step.number
                      ? 'text-primary'
                      : 'text-gray-400'
                  }`}
                >
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-24 h-1 mx-4 transition-all ${
                    currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-2">
            {/* Étape 1: Facturation */}
            {currentStep === 1 && (
              <Card>
                <h2 className="text-xl font-bold mb-6">Informations de facturation</h2>
                <form onSubmit={handleSubmitBilling}>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Prénom"
                      name="firstName"
                      value={billingInfo.firstName}
                      onChange={handleBillingChange}
                      required
                    />
                    <Input
                      label="Nom"
                      name="lastName"
                      value={billingInfo.lastName}
                      onChange={handleBillingChange}
                      required
                    />
                  </div>
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={billingInfo.email}
                    onChange={handleBillingChange}
                    required
                  />
                  <PhoneInput
                    label="Téléphone"
                    value={billingInfo.phone}
                    onChange={handlePhoneChange}
                    required
                    defaultCountry="BF"
                  />
                  <Button type="submit" fullWidth>
                    Continuer vers le paiement
                  </Button>
                </form>
              </Card>
            )}

            {/* Étape 2: Choix méthode paiement */}
            {currentStep === 2 && (
              <Card>
                <PaymentProviderSelector
                  onProviderChange={handleProviderChange}
                  disabled={processing}
                />

                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setCurrentStep(1)}
                  className="mt-6"
                >
                  Retour
                </Button>
              </Card>
            )}

            {/* Étape 3: Confirmation et paiement */}
            {currentStep === 3 && (
              <Card>
                <h2 className="text-xl font-bold mb-6">Confirmer et payer</h2>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-4">
                    <img
                      src="/images/ligdicash.png"
                      alt="Ligdicash"
                      className="h-10 object-contain"
                    />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Paiement sécurisé avec Ligdicash</p>
                      <p>Vous serez redirigé vers la plateforme Ligdicash pour finaliser la transaction.</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmitPayment}>
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold mb-3">Récapitulatif</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nombre d'articles</span>
                        <span className="font-medium">{cart.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Montant total</span>
                        <span className="font-bold text-lg text-primary">{formatPrice(getTotal())}</span>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" fullWidth className="mt-6">
                    Procéder au paiement
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    fullWidth
                    onClick={() => setCurrentStep(2)}
                    className="mt-3"
                  >
                    Retour
                  </Button>
                </form>
              </Card>
            )}
          </div>

          {/* Récapitulatif commande */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <h3 className="font-bold mb-4">Résumé de la commande</h3>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-12 shrink-0">
                      <CartItemImage item={item} />
                      <ImageWatermark
                        brandName="Pouire"
                        showPattern={false}
                        position="center"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs text-gray-600">
                        Licence {item.license_type}
                      </p>
                    </div>
                    <p className="text-sm font-bold">
                      {formatPrice(
                        item.license_type === 'extended'
                          ? item.price_extended
                          : item.price_standard
                      )}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(getTotal())}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal simulation paiement */}
      <Modal
        isOpen={showPaymentModal}
        onClose={paymentSuccess ? handleClosePaymentModal : () => {}}
        title={processing ? 'Traitement en cours' : paymentSuccess ? 'Paiement réussi' : 'Erreur'}
        closeOnOverlayClick={false}
        showCloseButton={!processing}
      >
        {processing ? (
          <div className="text-center py-8">
            <Spinner size="xl" />
            <p className="mt-4 text-gray-600">
              Connexion au service de paiement...
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Veuillez patienter quelques instants
            </p>
          </div>
        ) : paymentSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheck className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Paiement effectué avec succès !</h3>
            <p className="text-gray-600 mb-4">
              Numéro de commande : <span className="font-mono font-bold">{orderId}</span>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Vous allez recevoir un email de confirmation avec les liens de téléchargement
            </p>
            <Button fullWidth onClick={handleClosePaymentModal}>
              Voir mes commandes
            </Button>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
