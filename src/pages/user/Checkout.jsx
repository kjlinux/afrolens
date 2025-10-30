import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createOrder, processPayment } from '../../services/orderService';
import { formatPrice } from '../../utils/helpers';
import { FiCreditCard, FiSmartphone, FiCheck } from 'react-icons/fi';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';
import ImageWatermark from '../../components/photos/ImageWatermark';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, getTotal, clearCart } = useCart();
  const { user } = useAuth();
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

  const [paymentDetails, setPaymentDetails] = useState({
    // Mobile Money
    mobileProvider: 'orange',
    mobileNumber: '',
    // Card
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: '',
  });

  // Rediriger si panier vide
  if (cart.length === 0 && currentStep === 1) {
    navigate('/cart');
    return null;
  }

  const handleBillingChange = (e) => {
    setBillingInfo({ ...billingInfo, [e.target.name]: e.target.value });
  };

  const handlePaymentDetailsChange = (e) => {
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
  };

  const handleSubmitBilling = (e) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    setCurrentStep(3);
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    setShowPaymentModal(true);
    setProcessing(true);

    try {
      // Créer la commande
      const order = await createOrder({
        items: cart,
        total: getTotal(),
        billing: billingInfo,
      });

      // Simuler le paiement
      const payment = await processPayment({
        orderId: order.id,
        method: paymentMethod,
        details: paymentDetails,
      });

      if (payment.success) {
        setOrderId(order.order_number);
        setPaymentSuccess(true);
        clearCart();
      }
    } catch (error) {
      console.error('Erreur paiement:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
      setShowPaymentModal(false);
    } finally {
      setProcessing(false);
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
              <div
                className={`flex flex-col items-center ${
                  currentStep >= step.number ? 'opacity-100' : 'opacity-40'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                    currentStep >= step.number
                      ? 'bg-primary text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {currentStep > step.number ? '✓' : step.icon}
                </div>
                <p className="text-sm font-medium mt-2">{step.title}</p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-24 h-1 mx-4 ${
                    currentStep > step.number ? 'bg-primary' : 'bg-gray-300'
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
                  <Input
                    label="Téléphone"
                    name="phone"
                    type="tel"
                    value={billingInfo.phone}
                    onChange={handleBillingChange}
                    required
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
                <h2 className="text-xl font-bold mb-6">Méthode de paiement</h2>
                <div className="space-y-4">
                  <button
                    onClick={() => handlePaymentMethodSelect('mobile_money')}
                    className="w-full p-6 border-2 border-gray-200 rounded-lg hover:border-primary transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <FiSmartphone className="w-8 h-8 text-primary" />
                      <div>
                        <h3 className="font-semibold text-lg">Mobile Money</h3>
                        <p className="text-sm text-gray-600">
                          Orange Money, Moov Money, Telecel
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handlePaymentMethodSelect('card')}
                    className="w-full p-6 border-2 border-gray-200 rounded-lg hover:border-primary transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <FiCreditCard className="w-8 h-8 text-primary" />
                      <div>
                        <h3 className="font-semibold text-lg">Carte bancaire</h3>
                        <p className="text-sm text-gray-600">Visa, Mastercard</p>
                      </div>
                    </div>
                  </button>
                </div>

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

            {/* Étape 3: Détails paiement */}
            {currentStep === 3 && (
              <Card>
                <h2 className="text-xl font-bold mb-6">
                  {paymentMethod === 'mobile_money'
                    ? 'Paiement Mobile Money'
                    : 'Paiement par carte'}
                </h2>

                <form onSubmit={handleSubmitPayment}>
                  {paymentMethod === 'mobile_money' ? (
                    <>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                          Opérateur
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {['orange', 'moov', 'telecel'].map((provider) => (
                            <button
                              key={provider}
                              type="button"
                              onClick={() =>
                                setPaymentDetails({
                                  ...paymentDetails,
                                  mobileProvider: provider,
                                })
                              }
                              className={`p-3 border-2 rounded-lg font-medium capitalize ${
                                paymentDetails.mobileProvider === provider
                                  ? 'border-primary bg-primary/5'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              {provider}
                            </button>
                          ))}
                        </div>
                      </div>
                      <Input
                        label="Numéro de téléphone"
                        name="mobileNumber"
                        type="tel"
                        placeholder="70 00 00 00"
                        value={paymentDetails.mobileNumber}
                        onChange={handlePaymentDetailsChange}
                        required
                        helperText="Vous recevrez une notification pour confirmer le paiement"
                      />
                    </>
                  ) : (
                    <>
                      <Input
                        label="Numéro de carte"
                        name="cardNumber"
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={paymentDetails.cardNumber}
                        onChange={handlePaymentDetailsChange}
                        required
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Date d'expiration"
                          name="cardExpiry"
                          type="text"
                          placeholder="MM/AA"
                          value={paymentDetails.cardExpiry}
                          onChange={handlePaymentDetailsChange}
                          required
                        />
                        <Input
                          label="CVV"
                          name="cardCvv"
                          type="text"
                          placeholder="123"
                          value={paymentDetails.cardCvv}
                          onChange={handlePaymentDetailsChange}
                          required
                        />
                      </div>
                      <Input
                        label="Nom sur la carte"
                        name="cardName"
                        type="text"
                        placeholder="JOHN DOE"
                        value={paymentDetails.cardName}
                        onChange={handlePaymentDetailsChange}
                        required
                      />
                    </>
                  )}

                  <Button type="submit" fullWidth className="mt-6">
                    Payer {formatPrice(getTotal())}
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
                    <div className="relative w-16 h-12 flex-shrink-0">
                      <img
                        src={item.preview_url}
                        alt={item.title}
                        className="w-full h-full rounded object-cover"
                        onContextMenu={(e) => e.preventDefault()}
                        draggable={false}
                      />
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
