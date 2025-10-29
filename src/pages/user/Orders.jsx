import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getOrders } from '../../services/orderService';
import { formatPrice, formatDate, downloadFile } from '../../utils/helpers';
import { ORDER_STATUS, PAYMENT_PROVIDERS } from '../../utils/constants';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrders(user.id);
      setOrders(data);
    } catch (err) {
      setError('Impossible de charger les commandes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter(order => order.payment_status === statusFilter);

  const getStatusBadge = (status) => {
    const variants = {
      [ORDER_STATUS.COMPLETED]: 'success',
      [ORDER_STATUS.PENDING]: 'warning',
      [ORDER_STATUS.FAILED]: 'danger',
      [ORDER_STATUS.REFUNDED]: 'info',
    };

    const labels = {
      [ORDER_STATUS.COMPLETED]: 'Payée',
      [ORDER_STATUS.PENDING]: 'En attente',
      [ORDER_STATUS.FAILED]: 'Échouée',
      [ORDER_STATUS.REFUNDED]: 'Remboursée',
    };

    return (
      <Badge variant={variants[status] || 'gray'}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getPaymentProviderLabel = (provider) => {
    const labels = {
      [PAYMENT_PROVIDERS.ORANGE_MONEY]: 'Orange Money',
      [PAYMENT_PROVIDERS.MOOV_MONEY]: 'Moov Money',
      [PAYMENT_PROVIDERS.TELECEL_MONEY]: 'Telecel Money',
      [PAYMENT_PROVIDERS.STRIPE]: 'Carte bancaire',
      [PAYMENT_PROVIDERS.PAYPAL]: 'PayPal',
    };
    return labels[provider] || provider;
  };

  const handleDownload = (photoUrl, photoTitle) => {
    // Simule le téléchargement de la photo haute résolution
    // En production, cela devrait pointer vers l'URL de téléchargement sécurisé
    const highResUrl = photoUrl.replace('.jpg', '_full.jpg');
    downloadFile(highResUrl, `${photoTitle}.jpg`);
  };

  const handleDownloadInvoice = (invoiceUrl, orderNumber) => {
    downloadFile(invoiceUrl, `Facture_${orderNumber}.pdf`);
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadOrders}>Réessayer</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mes Commandes</h1>
        <p className="text-gray-600">
          Consultez l'historique de vos achats et téléchargez vos photos
        </p>
      </div>

      {/* Filtres de statut */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button
          variant={statusFilter === 'all' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setStatusFilter('all')}
        >
          Toutes ({orders.length})
        </Button>
        <Button
          variant={statusFilter === ORDER_STATUS.COMPLETED ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setStatusFilter(ORDER_STATUS.COMPLETED)}
        >
          Payées ({orders.filter(o => o.payment_status === ORDER_STATUS.COMPLETED).length})
        </Button>
        <Button
          variant={statusFilter === ORDER_STATUS.PENDING ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setStatusFilter(ORDER_STATUS.PENDING)}
        >
          En attente ({orders.filter(o => o.payment_status === ORDER_STATUS.PENDING).length})
        </Button>
      </div>

      {/* Liste des commandes */}
      {filteredOrders.length === 0 ? (
        <Card className="text-center py-12">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune commande
          </h3>
          <p className="text-gray-600 mb-6">
            {statusFilter === 'all'
              ? "Vous n'avez pas encore effectué d'achat"
              : `Aucune commande ${statusFilter === ORDER_STATUS.COMPLETED ? 'payée' : 'en attente'}`
            }
          </p>
          <Link to="/search">
            <Button>Explorer les photos</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              {/* En-tête de la commande */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Commande {order.order_number}
                      </h3>
                      {getStatusBadge(order.payment_status)}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span>
                        {formatDate(order.created_at, 'dd MMM yyyy à HH:mm')}
                      </span>
                      <span>•</span>
                      <span>
                        {order.items.length} photo{order.items.length > 1 ? 's' : ''}
                      </span>
                      {order.payment_provider && (
                        <>
                          <span>•</span>
                          <span>{getPaymentProviderLabel(order.payment_provider)}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {formatPrice(order.total)}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleOrderDetails(order.id)}
                    >
                      {expandedOrder === order.id ? 'Masquer' : 'Détails'}
                      <svg
                        className={`ml-1 h-4 w-4 transition-transform ${
                          expandedOrder === order.id ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Détails de la commande (expansible) */}
              {expandedOrder === order.id && (
                <div className="p-6 bg-gray-50">
                  {/* Items de la commande */}
                  <div className="space-y-4 mb-6">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-4 bg-white p-4 rounded-lg"
                      >
                        <Link
                          to={`/photo/${item.photo_id}`}
                          className="flex-shrink-0"
                        >
                          <img
                            src={item.photo_preview}
                            alt={item.photo_title}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/photo/${item.photo_id}`}
                            className="text-lg font-medium text-gray-900 hover:text-primary"
                          >
                            {item.photo_title}
                          </Link>
                          <p className="text-sm text-gray-600 mt-1">
                            Par {item.photographer_name}
                          </p>
                          <div className="mt-2">
                            <Badge variant="gray" size="sm">
                              Licence {item.license_type === 'standard' ? 'Standard' : 'Étendue'}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900 mb-2">
                            {formatPrice(item.price)}
                          </div>
                          {order.payment_status === ORDER_STATUS.COMPLETED && (
                            <Button
                              size="sm"
                              onClick={() => handleDownload(item.photo_preview, item.photo_title)}
                            >
                              <svg
                                className="mr-1 h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                              </svg>
                              Télécharger
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Résumé de la commande */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="max-w-sm ml-auto space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Sous-total</span>
                        <span className="text-gray-900">{formatPrice(order.subtotal)}</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Réduction</span>
                          <span className="text-green-600">-{formatPrice(order.discount)}</span>
                        </div>
                      )}
                      {order.tax > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">TVA</span>
                          <span className="text-gray-900">{formatPrice(order.tax)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
                        <span className="text-gray-900">Total</span>
                        <span className="text-gray-900">{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
                    {order.invoice_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadInvoice(order.invoice_url, order.order_number)}
                      >
                        <svg
                          className="mr-1 h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Télécharger la facture
                      </Button>
                    )}
                    {order.payment_status === ORDER_STATUS.COMPLETED && (
                      <Button variant="outline" size="sm">
                        <svg
                          className="mr-1 h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                          />
                        </svg>
                        Télécharger tout ({order.items.length})
                      </Button>
                    )}
                  </div>

                  {/* Informations de paiement */}
                  {order.payment_id && (
                    <div className="mt-4 p-3 bg-white rounded-lg">
                      <p className="text-xs text-gray-500">
                        ID de transaction : {order.payment_id}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Statistiques rapides */}
      {orders.length > 0 && (
        <Card className="mt-8 p-6">
          <h3 className="text-lg font-semibold mb-4">Statistiques</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total dépensé</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(
                  orders
                    .filter(o => o.payment_status === ORDER_STATUS.COMPLETED)
                    .reduce((sum, o) => sum + o.total, 0)
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Photos achetées</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders
                  .filter(o => o.payment_status === ORDER_STATUS.COMPLETED)
                  .reduce((sum, o) => sum + o.items.length, 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Commandes</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(o => o.payment_status === ORDER_STATUS.COMPLETED).length}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
