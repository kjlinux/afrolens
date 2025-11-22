import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  Calendar,
  User,
  ShoppingBag,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Image,
} from "lucide-react";
import { AdminOrdersService } from "../../api";
import { formatPrice, formatDate } from "../../utils/helpers";
import { useToast } from "../../contexts/ToastContext";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Modal from "../../components/common/Modal";
import Spinner from "../../components/common/Spinner";

export default function Orders() {
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Filters
  const [filterStatus, setFilterStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 20,
  });

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    failed: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    loadOrders();
  }, [filterStatus, dateFrom, dateTo]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await AdminOrdersService.getAdminOrders(
        filterStatus || undefined,
        undefined,
        undefined,
        dateFrom || undefined,
        dateTo || undefined,
        searchQuery || undefined,
        pagination.perPage
      );

      const ordersData = response.data || [];
      setOrders(ordersData);

      if (response.meta) {
        setPagination({
          currentPage: response.meta.current_page || 1,
          lastPage: response.meta.last_page || 1,
          total: response.meta.total || 0,
          perPage: response.meta.per_page || 20,
        });
      }

      // Calculate stats from loaded orders
      const completed = ordersData.filter(o => o.payment_status === "completed").length;
      const pending = ordersData.filter(o => o.payment_status === "pending").length;
      const failed = ordersData.filter(o => o.payment_status === "failed").length;
      const totalRevenue = ordersData
        .filter(o => o.payment_status === "completed")
        .reduce((sum, o) => sum + (o.total || 0), 0);

      setStats({
        total: ordersData.length,
        completed,
        pending,
        failed,
        totalRevenue,
      });

    } catch (err) {
      console.error("Erreur chargement commandes:", err);
      setError(err.message || "Impossible de charger les commandes");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadOrders();
  };

  const handleViewDetails = async (orderId) => {
    try {
      const response = await AdminOrdersService.getAdminOrder(orderId);
      setSelectedOrder(response.data || response);
    } catch (err) {
      toast.error("Impossible de charger les détails de la commande");
    }
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusBadge = (status) => {
    const configs = {
      pending: { variant: "warning", label: "En attente", icon: Clock },
      processing: { variant: "info", label: "En cours", icon: RefreshCw },
      completed: { variant: "success", label: "Complétée", icon: CheckCircle },
      failed: { variant: "danger", label: "Échouée", icon: XCircle },
      refunded: { variant: "gray", label: "Remboursée", icon: RefreshCw },
    };

    const config = configs[status] || configs.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getPaymentMethodLabel = (method) => {
    const labels = {
      mobile_money: "Mobile Money",
      card: "Carte bancaire",
    };
    return labels[method] || method;
  };

  const OrderDetailModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <Modal
        isOpen={!!order}
        onClose={onClose}
        title={`Commande ${order.order_number}`}
        size="large"
      >
        <div className="p-6">
          {/* Header avec statut */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {order.order_number}
              </h3>
              <p className="text-sm text-gray-600">
                {formatDate(order.created_at, "dd MMMM yyyy à HH:mm")}
              </p>
            </div>
            {getStatusBadge(order.payment_status)}
          </div>

          {/* Informations acheteur */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Acheteur
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Nom:</span>
                <span className="ml-2 font-medium">
                  {order.user?.first_name} {order.user?.last_name}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Email:</span>
                <span className="ml-2 font-medium">{order.user?.email}</span>
              </div>
              {order.billing_phone && (
                <div>
                  <span className="text-gray-600">Téléphone:</span>
                  <span className="ml-2 font-medium">{order.billing_phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Items de la commande */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Image className="w-4 h-4" />
              Photos ({order.items?.length || 0})
            </h4>
            <div className="space-y-3">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 bg-white border rounded-lg"
                >
                  <img
                    src={item.photo?.thumbnail_url || item.photo?.preview_url}
                    alt={item.photo?.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {item.photo?.title || "Photo sans titre"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Par {item.photo?.photographer?.display_name || "Inconnu"}
                    </p>
                    <Badge variant="gray" size="sm">
                      Licence {item.license_type === "standard" ? "Standard" : "Étendue"}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Résumé financier */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Résumé financier
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Sous-total</span>
                <span className="font-medium">{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Réduction</span>
                  <span className="text-green-600">-{formatPrice(order.discount)}</span>
                </div>
              )}
              {order.tax > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">TVA</span>
                  <span className="font-medium">{formatPrice(order.tax)}</span>
                </div>
              )}
              {order.commission > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Commission plateforme</span>
                  <span className="font-medium">{formatPrice(order.commission)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t font-semibold text-lg">
                <span>Total</span>
                <span className="text-primary-600">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Informations de paiement */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">
              Informations de paiement
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Méthode:</span>
                <span className="ml-2 font-medium">
                  {getPaymentMethodLabel(order.payment_method)}
                </span>
              </div>
              {order.transaction_id && (
                <div>
                  <span className="text-gray-600">ID Transaction:</span>
                  <span className="ml-2 font-mono text-xs">
                    {order.transaction_id}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestion des commandes
        </h1>
        <p className="text-gray-600 mt-2">
          Consultez et gérez toutes les commandes de la plateforme
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Complétées</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Échouées</p>
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Revenus</p>
              <p className="text-lg font-bold text-primary-600">
                {formatPrice(stats.totalRevenue)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtres */}
      <Card className="p-4 mb-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Recherche */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par numéro de commande..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Filtre statut */}
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="completed">Complétées</option>
                <option value="failed">Échouées</option>
                <option value="refunded">Remboursées</option>
              </select>
            </div>

            {/* Date de début */}
            <div className="flex items-center gap-2">
              <Calendar className="text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Date de fin */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400">à</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <Button type="submit" variant="primary">
              Rechercher
            </Button>
          </div>
        </form>
      </Card>

      {/* Liste des commandes */}
      <Card className="p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Erreur de chargement
            </h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={loadOrders}>Réessayer</Button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucune commande
            </h3>
            <p className="text-gray-500">
              {filterStatus || searchQuery || dateFrom || dateTo
                ? "Aucune commande ne correspond à vos critères"
                : "Aucune commande enregistrée"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* En-tête de la commande */}
                <div className="p-4 bg-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {order.order_number}
                        </h3>
                        {getStatusBadge(order.payment_status)}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {order.user?.first_name} {order.user?.last_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(order.created_at, "dd/MM/yyyy HH:mm")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Image className="w-4 h-4" />
                          {order.items?.length || 0} photo{(order.items?.length || 0) > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900 mb-2">
                        {formatPrice(order.total)}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleOrderExpand(order.id)}
                        >
                          {expandedOrder === order.id ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(order.id)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Détails
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Détails expansibles */}
                {expandedOrder === order.id && (
                  <div className="p-4 bg-gray-50 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Email acheteur</p>
                        <p className="font-medium">{order.user?.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Méthode de paiement</p>
                        <p className="font-medium">
                          {getPaymentMethodLabel(order.payment_method)}
                        </p>
                      </div>
                      {order.transaction_id && (
                        <div className="col-span-2">
                          <p className="text-sm text-gray-600">ID Transaction</p>
                          <p className="font-mono text-sm">{order.transaction_id}</p>
                        </div>
                      )}
                    </div>

                    {/* Aperçu des items */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Photos:</p>
                      <div className="flex flex-wrap gap-2">
                        {order.items?.slice(0, 5).map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border"
                          >
                            <img
                              src={item.photo?.thumbnail_url}
                              alt={item.photo?.title}
                              className="w-8 h-8 object-cover rounded"
                            />
                            <span className="text-sm text-gray-700 truncate max-w-[150px]">
                              {item.photo?.title}
                            </span>
                            <span className="text-sm font-medium">
                              {formatPrice(item.price)}
                            </span>
                          </div>
                        ))}
                        {(order.items?.length || 0) > 5 && (
                          <span className="text-sm text-gray-500 self-center">
                            +{order.items.length - 5} autres
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination info */}
        {orders.length > 0 && (
          <div className="mt-6 pt-4 border-t text-center text-sm text-gray-600">
            Affichage de {orders.length} commande{orders.length > 1 ? "s" : ""} sur {pagination.total}
          </div>
        )}
      </Card>

      {/* Modal Détails */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
