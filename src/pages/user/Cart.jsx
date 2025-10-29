import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/helpers';
import { FiTrash2, FiShoppingCart, FiArrowRight } from 'react-icons/fi';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartItem, clearCart, getTotal, getItemCount } = useCart();

  const handleUpdateLicense = (itemId, newLicense) => {
    const item = cart.find((i) => i.id === itemId);
    if (item) {
      const newPrice =
        newLicense === 'extended' ? item.price_extended : item.price_standard;
      updateCartItem(itemId, { ...item, license_type: newLicense, price: newPrice });
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="text-6xl mb-6">🛒</div>
            <h1 className="text-3xl font-bold mb-4">Votre panier est vide</h1>
            <p className="text-gray-600 mb-8">
              Découvrez notre collection de photos professionnelles
            </p>
            <Button onClick={() => navigate('/search')}>
              Parcourir les photos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            Mon Panier ({getItemCount()} {getItemCount() > 1 ? 'articles' : 'article'})
          </h1>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Vider le panier
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.id} noPadding>
                <div className="p-4 flex gap-4">
                  {/* Image */}
                  <Link
                    to={`/photo/${item.id}`}
                    className="flex-shrink-0 w-32 h-24 rounded-lg overflow-hidden bg-gray-200"
                  >
                    <img
                      src={item.preview_url}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform"
                    />
                  </Link>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/photo/${item.id}`}
                      className="font-semibold text-gray-900 hover:text-primary mb-1 block truncate"
                    >
                      {item.title}
                    </Link>
                    <p className="text-sm text-gray-600 mb-2">
                      Par {item.photographer_name || 'Photographe'}
                    </p>

                    {/* Choix licence */}
                    <div className="flex gap-2 mb-2">
                      <button
                        onClick={() => handleUpdateLicense(item.id, 'standard')}
                        className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                          item.license_type === 'standard'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Standard
                      </button>
                      {item.price_extended && (
                        <button
                          onClick={() => handleUpdateLicense(item.id, 'extended')}
                          className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                            item.license_type === 'extended'
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Extended
                        </button>
                      )}
                    </div>

                    <Badge variant="info" size="sm">
                      Licence {item.license_type === 'extended' ? 'Extended' : 'Standard'}
                    </Badge>
                  </div>

                  {/* Prix et actions */}
                  <div className="flex flex-col items-end justify-between">
                    <p className="text-lg font-bold text-primary">
                      {formatPrice(
                        item.license_type === 'extended'
                          ? item.price_extended || item.price_standard
                          : item.price_standard
                      )}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Retirer du panier"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <h2 className="text-xl font-bold mb-6">Récapitulatif</h2>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between text-gray-700">
                  <span>Sous-total ({getItemCount()} articles)</span>
                  <span className="font-semibold">{formatPrice(getTotal())}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Frais de service</span>
                  <span className="font-semibold">Gratuit</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Total</span>
                <span className="text-primary">{formatPrice(getTotal())}</span>
              </div>

              <Button
                fullWidth
                onClick={handleCheckout}
                className="flex items-center justify-center gap-2 mb-4"
              >
                Passer la commande
                <FiArrowRight />
              </Button>

              <Link
                to="/search"
                className="block text-center text-primary hover:text-primary-dark text-sm font-medium"
              >
                Continuer mes achats
              </Link>

              {/* Info sécurité */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                <p className="flex items-start gap-2">
                  <span className="text-green-600">🔒</span>
                  <span>
                    Paiement 100% sécurisé. Vos photos seront disponibles immédiatement
                    après paiement.
                  </span>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
