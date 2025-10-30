import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Image, DollarSign, Clock, TrendingUp, AlertCircle, ShoppingCart, UserCheck } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { users, photos, orders } from '../../data/mockData';
import { formatPrice, formatNumber, formatDate } from '../../utils/helpers';
import { PHOTO_STATUS } from '../../utils/constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    // Simuler le chargement
    setTimeout(() => setLoading(false), 500);
  }, []);

  // Calculer les statistiques réelles depuis les données mockées
  const stats = {
    totalUsers: users.length,
    buyers: users.filter(u => u.role === 'buyer').length,
    photographers: users.filter(u => u.role === 'photographer').length,
    admins: users.filter(u => u.role === 'admin').length,

    totalPhotos: photos.length,
    approvedPhotos: photos.filter(p => p.status === PHOTO_STATUS.APPROVED).length,
    pendingPhotos: photos.filter(p => p.status === PHOTO_STATUS.PENDING).length,
    rejectedPhotos: photos.filter(p => p.status === PHOTO_STATUS.REJECTED).length,

    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total_price, 0),
    commission: orders.reduce((sum, o) => sum + o.total_price * 0.20, 0),

    // Stats ce mois
    newUsersThisMonth: 12,
    newPhotosThisMonth: 24,
    ordersThisMonth: orders.filter(o => {
      const orderDate = new Date(o.created_at);
      const now = new Date();
      return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
    }).length,
  };

  // Données pour les graphiques
  const revenueData = [
    { month: 'Jan', revenue: 45000, commission: 9000, orders: 45 },
    { month: 'Fév', revenue: 52000, commission: 10400, orders: 52 },
    { month: 'Mar', revenue: 48000, commission: 9600, orders: 48 },
    { month: 'Avr', revenue: 61000, commission: 12200, orders: 61 },
    { month: 'Mai', revenue: 55000, commission: 11000, orders: 55 },
    { month: 'Juin', revenue: 67000, commission: 13400, orders: 67 },
    { month: 'Juil', revenue: 72000, commission: 14400, orders: 72 },
    { month: 'Août', revenue: 68000, commission: 13600, orders: 68 },
    { month: 'Sep', revenue: 74000, commission: 14800, orders: 74 },
    { month: 'Oct', revenue: 81000, commission: 16200, orders: 81 },
  ];

  const usersGrowthData = [
    { month: 'Jan', buyers: 45, photographers: 12, total: 57 },
    { month: 'Fév', buyers: 58, photographers: 15, total: 73 },
    { month: 'Mar', buyers: 72, photographers: 18, total: 90 },
    { month: 'Avr', buyers: 89, photographers: 21, total: 110 },
    { month: 'Mai', buyers: 105, photographers: 25, total: 130 },
    { month: 'Juin', buyers: 124, photographers: 28, total: 152 },
  ];

  const photoStatusData = [
    { name: 'Approuvées', value: stats.approvedPhotos, color: '#22c55e' },
    { name: 'En attente', value: stats.pendingPhotos, color: '#f59e0b' },
    { name: 'Rejetées', value: stats.rejectedPhotos, color: '#ef4444' },
  ];

  // Activités récentes
  const recentActivity = [
    {
      type: 'user',
      message: 'Nouvel utilisateur inscrit: Amadou Traoré',
      time: 'Il y a 5 minutes',
      icon: Users,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      type: 'photo',
      message: '3 nouvelles photos uploadées par Fatou Kaboré',
      time: 'Il y a 15 minutes',
      icon: Image,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      type: 'order',
      message: 'Nouvelle commande de 45 FCFA',
      time: 'Il y a 1 heure',
      icon: ShoppingCart,
      color: 'bg-green-100 text-green-600'
    },
    {
      type: 'moderation',
      message: '2 photos en attente de modération',
      time: 'Il y a 2 heures',
      icon: AlertCircle,
      color: 'bg-orange-100 text-orange-600'
    },
    {
      type: 'photographer',
      message: 'Nouvelle demande de photographe: Ibrahim Sawadogo',
      time: 'Il y a 3 heures',
      icon: UserCheck,
      color: 'bg-indigo-100 text-indigo-600'
    },
  ];

  // Top photographes
  const topPhotographers = [
    { id: 1, name: 'Fatou Kaboré', photos: 65, sales: 234, revenue: 10530 },
    { id: 2, name: 'Amadou Traoré', photos: 52, sales: 189, revenue: 8505 },
    { id: 3, name: 'Ibrahim Sawadogo', photos: 48, sales: 156, revenue: 7020 },
    { id: 4, name: 'Awa Ouédraogo', photos: 41, sales: 142, revenue: 6390 },
    { id: 5, name: 'Boureima Zongo', photos: 38, sales: 128, revenue: 5760 },
  ];

  const StatCard = ({ icon: Icon, title, value, subtitle, change, color, link }) => {
    const content = (
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {change !== undefined && (
            <span className={`text-sm font-medium flex items-center gap-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className={`w-4 h-4 ${change < 0 ? 'rotate-180' : ''}`} />
              {change >= 0 ? '+' : ''}{change}%
            </span>
          )}
        </div>
        <h3 className="text-sm text-gray-600">{title}</h3>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </Card>
    );

    return link ? <Link to={link}>{content}</Link> : content;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-gray-600 mt-2">Vue d'ensemble de la plateforme POUIRE</p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Users}
          title="Total Utilisateurs"
          value={formatNumber(stats.totalUsers)}
          subtitle={`${stats.photographers} photographes, ${stats.buyers} acheteurs`}
          change={8.5}
          color="bg-blue-600"
          link="/admin/users"
        />
        <StatCard
          icon={Image}
          title="Total Photos"
          value={formatNumber(stats.totalPhotos)}
          subtitle={`${stats.pendingPhotos} en attente`}
          change={12.3}
          color="bg-purple-600"
          link="/admin/moderation"
        />
        <StatCard
          icon={DollarSign}
          title="Revenus Totaux"
          value={formatPrice(stats.totalRevenue)}
          subtitle={`Commission: ${formatPrice(stats.commission)}`}
          change={15.2}
          color="bg-green-600"
          link="/admin/orders"
        />
        <StatCard
          icon={Clock}
          title="En Modération"
          value={formatNumber(stats.pendingPhotos)}
          subtitle="Photos à approuver"
          color="bg-orange-600"
          link="/admin/moderation"
        />
      </div>

      {/* Graphiques - Revenus et Commandes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-6">Évolution des revenus</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatPrice(value)} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#22c55e"
                strokeWidth={2}
                name="Revenus (FCFA)"
              />
              <Line
                type="monotone"
                dataKey="commission"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Commission (FCFA)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Statut des photos */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Statut des photos</h2>
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
        </Card>
      </div>

      {/* Croissance utilisateurs */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Croissance des utilisateurs</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={usersGrowthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="buyers" fill="#3b82f6" name="Acheteurs" />
            <Bar dataKey="photographers" fill="#8b5cf6" name="Photographes" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

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
            {topPhotographers.map((photographer, index) => (
              <div key={photographer.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                  #{index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{photographer.name}</p>
                  <p className="text-sm text-gray-600">
                    {photographer.photos} photos • {photographer.sales} ventes
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{formatPrice(photographer.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Activité récente */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Activité Récente</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className={`flex-shrink-0 p-2 rounded-full ${activity.color}`}>
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/admin/moderation">
            <button className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left">
              <Clock className="w-6 h-6 text-orange-600 mb-2" />
              <p className="font-semibold text-gray-900">Modérer les photos</p>
              <p className="text-sm text-gray-600">{stats.pendingPhotos} en attente</p>
            </button>
          </Link>

          <Link to="/admin/photographers-pending">
            <button className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left">
              <UserCheck className="w-6 h-6 text-indigo-600 mb-2" />
              <p className="font-semibold text-gray-900">Valider photographes</p>
              <p className="text-sm text-gray-600">Nouvelles demandes</p>
            </button>
          </Link>

          <Link to="/admin/users">
            <button className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left">
              <Users className="w-6 h-6 text-blue-600 mb-2" />
              <p className="font-semibold text-gray-900">Gérer utilisateurs</p>
              <p className="text-sm text-gray-600">{stats.totalUsers} utilisateurs</p>
            </button>
          </Link>

          <Link to="/admin/withdrawals">
            <button className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left">
              <DollarSign className="w-6 h-6 text-green-600 mb-2" />
              <p className="font-semibold text-gray-900">Retraits</p>
              <p className="text-sm text-gray-600">Demandes en attente</p>
            </button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
