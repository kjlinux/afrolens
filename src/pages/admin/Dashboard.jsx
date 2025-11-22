import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Image, DollarSign, Clock, TrendingUp, AlertCircle, ShoppingCart, UserCheck, Wallet, CheckCircle, XCircle, Star } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getDashboardStats } from '../../services/adminService';
import { formatPrice, formatNumber, formatDate } from '../../utils/helpers';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDashboardStats();
      // Extract data from API response
      const data = response.data || {};

      // Transform API response to match component expectations
      const transformedData = {
        // Users data
        totalUsers: data.users?.total || 0,
        photographers: data.users?.photographers || 0,
        buyers: data.users?.buyers || 0,
        admins: data.users?.admins || 0,
        verifiedUsers: data.users?.verified || 0,
        newUsersThisMonth: data.users?.new_this_month || 0,

        // Photos data
        totalPhotos: data.photos?.total || 0,
        pendingPhotos: data.photos?.pending || 0,
        approvedPhotos: data.photos?.approved || 0,
        rejectedPhotos: data.photos?.rejected || 0,
        featuredPhotos: data.photos?.featured || 0,
        photosUploadedThisMonth: data.photos?.uploaded_this_month || 0,

        // Orders data
        totalOrders: data.orders?.total || 0,
        pendingOrders: data.orders?.pending || 0,
        completedOrders: data.orders?.completed || 0,
        failedOrders: data.orders?.failed || 0,
        totalRevenue: parseFloat(data.orders?.total_revenue) || 0,
        ordersThisMonth: data.orders?.orders_this_month || 0,
        revenueThisMonth: parseFloat(data.orders?.revenue_this_month) || 0,
        commission: (parseFloat(data.orders?.total_revenue) || 0) * 0.2,

        // Withdrawals data
        totalWithdrawals: data.withdrawals?.total || 0,
        pendingWithdrawals: data.withdrawals?.pending || 0,
        approvedWithdrawals: data.withdrawals?.approved || 0,
        rejectedWithdrawals: data.withdrawals?.rejected || 0,
        pendingWithdrawalAmount: parseFloat(data.withdrawals?.pending_amount) || 0,

        // Recent activity
        latestOrders: data.recent_activity?.latest_orders || [],
        latestPhotos: data.recent_activity?.latest_photos || [],
        latestUsers: data.recent_activity?.latest_users || [],

        // Platform stats
        activePhotographers: data.platform?.active_photographers || 0,
        averagePhotoPrice: parseFloat(data.platform?.average_photo_price) || 0,
        conversionRate: data.platform?.conversion_rate || 0,
        // Trier les top photographes par ventes décroissantes
        topPhotographers: (data.platform?.top_photographers || [])
          .sort((a, b) => (parseFloat(b.total_sales) || 0) - (parseFloat(a.total_sales) || 0)),
      };

      setDashboardData(transformedData);
    } catch (err) {
      console.error('Erreur chargement dashboard admin:', err);
      setError(err.message || 'Impossible de charger le dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <Card className="p-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadDashboard}>Réessayer</Button>
        </Card>
      </div>
    );
  }

  if (!dashboardData) return null;

  const stats = dashboardData;

  // Données pour le graphique de statut des photos
  const photoStatusData = [
    { name: 'Approuvées', value: stats.approvedPhotos || 0, color: '#22c55e' },
    { name: 'En attente', value: stats.pendingPhotos || 0, color: '#f59e0b' },
    { name: 'Rejetées', value: stats.rejectedPhotos || 0, color: '#ef4444' },
  ];

  // Données pour le graphique de statut des commandes
  const orderStatusData = [
    { name: 'Complétées', value: stats.completedOrders || 0, color: '#22c55e' },
    { name: 'En attente', value: stats.pendingOrders || 0, color: '#f59e0b' },
    { name: 'Échouées', value: stats.failedOrders || 0, color: '#ef4444' },
  ];

  // Fonction pour obtenir le badge de statut de paiement
  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Complétée</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">En attente</span>;
      case 'failed':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Échouée</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  // Fonction pour obtenir le badge de statut de photo
  const getPhotoStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Approuvée</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">En attente</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Rejetée</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, change, color, link }) => {
    const content = (
      <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className={`p-2 sm:p-3 rounded-lg ${color}`}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          {change !== undefined && (
            <span className={`text-xs sm:text-sm font-medium flex items-center gap-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className={`w-3 h-3 sm:w-4 sm:h-4 ${change < 0 ? 'rotate-180' : ''}`} />
              {change >= 0 ? '+' : ''}{change}%
            </span>
          )}
        </div>
        <h3 className="text-xs sm:text-sm text-gray-600">{title}</h3>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">{value}</p>
        {subtitle && <p className="text-xs sm:text-sm text-gray-500 mt-1">{subtitle}</p>}
      </Card>
    );

    return link ? <Link to={link}>{content}</Link> : content;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Vue d'ensemble de la plateforme POUIRE</p>
      </div>

      {/* Statistiques principales - Ligne 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <StatCard
          icon={Users}
          title="Total Utilisateurs"
          value={formatNumber(stats.totalUsers)}
          subtitle={`${stats.photographers} photographes, ${stats.buyers} acheteurs, ${stats.admins} admins`}
          color="bg-blue-600"
          link="/admin/users"
        />
        <StatCard
          icon={Image}
          title="Total Photos"
          value={formatNumber(stats.totalPhotos)}
          subtitle={`${stats.featuredPhotos} en vedette`}
          color="bg-purple-600"
          link="/admin/moderation"
        />
        <StatCard
          icon={ShoppingCart}
          title="Total Commandes"
          value={formatNumber(stats.totalOrders)}
          subtitle={`${stats.ordersThisMonth} ce mois`}
          color="bg-indigo-600"
          link="/admin/orders"
        />
        <StatCard
          icon={DollarSign}
          title="Revenus Totaux"
          value={formatPrice(stats.totalRevenue)}
          subtitle={`Ce mois: ${formatPrice(stats.revenueThisMonth)}`}
          color="bg-green-600"
          link="/admin/orders"
        />
      </div>

      {/* Statistiques secondaires - Ligne 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <StatCard
          icon={Clock}
          title="En Modération"
          value={formatNumber(stats.pendingPhotos)}
          subtitle="Photos à approuver"
          color="bg-orange-600"
          link="/admin/moderation"
        />
        <StatCard
          icon={Wallet}
          title="Retraits en Attente"
          value={formatNumber(stats.pendingWithdrawals)}
          subtitle={`Montant: ${formatPrice(stats.pendingWithdrawalAmount)}`}
          color="bg-red-600"
          link="/admin/withdrawals"
        />
        <StatCard
          icon={CheckCircle}
          title="Utilisateurs Vérifiés"
          value={formatNumber(stats.verifiedUsers)}
          subtitle={`${stats.newUsersThisMonth} nouveaux ce mois`}
          color="bg-teal-600"
          link="/admin/users"
        />
        <StatCard
          icon={Star}
          title="Photographes Actifs"
          value={formatNumber(stats.activePhotographers)}
          subtitle={`Prix moyen: ${formatPrice(Math.round(stats.averagePhotoPrice))}`}
          color="bg-yellow-600"
          link="/admin/users?role=photographer"
        />
      </div>

      {/* Graphiques - Statut photos et commandes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Statut des photos */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Statut des photos</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={photoStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {photoStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
            <div>
              <p className="font-semibold text-green-600">{stats.approvedPhotos}</p>
              <p className="text-gray-500">Approuvées</p>
            </div>
            <div>
              <p className="font-semibold text-yellow-600">{stats.pendingPhotos}</p>
              <p className="text-gray-500">En attente</p>
            </div>
            <div>
              <p className="font-semibold text-red-600">{stats.rejectedPhotos}</p>
              <p className="text-gray-500">Rejetées</p>
            </div>
          </div>
        </Card>

        {/* Statut des commandes */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Statut des commandes</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
            <div>
              <p className="font-semibold text-green-600">{stats.completedOrders}</p>
              <p className="text-gray-500">Complétées</p>
            </div>
            <div>
              <p className="font-semibold text-yellow-600">{stats.pendingOrders}</p>
              <p className="text-gray-500">En attente</p>
            </div>
            <div>
              <p className="font-semibold text-red-600">{stats.failedOrders}</p>
              <p className="text-gray-500">Échouées</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Photographes */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Top 5 Photographes</h2>
            <Link to="/admin/users?role=photographer">
              <Button variant="ghost" size="sm">Voir tout</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {stats.topPhotographers.map((photographer, index) => (
              <div key={photographer.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                  #{index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{photographer.name}</p>
                  <p className="text-sm text-gray-600">
                    {photographer.photos_count} photos
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{formatPrice(parseFloat(photographer.total_sales) || 0)}</p>
                </div>
              </div>
            ))}
            {stats.topPhotographers.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">Aucun photographe trouvé</p>
            )}
          </div>
        </Card>

        {/* Dernières commandes */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Dernières Commandes</h2>
            <Link to="/admin/orders">
              <Button variant="ghost" size="sm">Voir tout</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {stats.latestOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 p-2 rounded-full bg-green-100 text-green-600">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {order.order_number}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.user?.first_name} {order.user?.last_name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatPrice(order.total)}</p>
                  {getPaymentStatusBadge(order.payment_status)}
                </div>
              </div>
            ))}
            {stats.latestOrders.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">Aucune commande récente</p>
            )}
          </div>
        </Card>
      </div>

      {/* Dernières photos et utilisateurs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Dernières photos */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Dernières Photos</h2>
            <Link to="/admin/moderation">
              <Button variant="ghost" size="sm">Voir tout</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {stats.latestPhotos.map((photo) => (
              <div key={photo.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 p-2 rounded-full bg-purple-100 text-purple-600">
                  <Image className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{photo.title}</p>
                  <p className="text-xs text-gray-500">
                    {photo.photographer?.first_name} {photo.photographer?.last_name}
                  </p>
                </div>
                <div>
                  {getPhotoStatusBadge(photo.status)}
                </div>
              </div>
            ))}
            {stats.latestPhotos.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">Aucune photo récente</p>
            )}
          </div>
        </Card>

        {/* Derniers utilisateurs */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Derniers Utilisateurs</h2>
            <Link to="/admin/users">
              <Button variant="ghost" size="sm">Voir tout</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {stats.latestUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 p-2 rounded-full bg-blue-100 text-blue-600">
                  <Users className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.account_type === 'photographer'
                      ? 'bg-purple-100 text-purple-800'
                      : user.account_type === 'admin'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.account_type === 'buyer' ? 'Acheteur' :
                     user.account_type === 'photographer' ? 'Photographe' : 'Admin'}
                  </span>
                </div>
              </div>
            ))}
            {stats.latestUsers.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">Aucun utilisateur récent</p>
            )}
          </div>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Link to="/admin/moderation">
            <button className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-600/5 transition-colors text-left">
              <Clock className="w-6 h-6 text-orange-600 mb-2" />
              <p className="font-semibold text-gray-900">Modérer les photos</p>
              <p className="text-sm text-gray-600">{stats.pendingPhotos} en attente</p>
            </button>
          </Link>

          <Link to="/admin/withdrawals">
            <button className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-600/5 transition-colors text-left">
              <Wallet className="w-6 h-6 text-red-600 mb-2" />
              <p className="font-semibold text-gray-900">Retraits</p>
              <p className="text-sm text-gray-600">{stats.pendingWithdrawals} en attente</p>
            </button>
          </Link>

          <Link to="/admin/users">
            <button className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-600/5 transition-colors text-left">
              <Users className="w-6 h-6 text-blue-600 mb-2" />
              <p className="font-semibold text-gray-900">Gérer utilisateurs</p>
              <p className="text-sm text-gray-600">{stats.totalUsers} utilisateurs</p>
            </button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
