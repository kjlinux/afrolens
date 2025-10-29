import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { formatPrice, formatNumber } from '../../utils/helpers';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d'); // 7d, 30d, 90d, 1y

  // Données mockées - en production, cela viendrait de l'API
  const stats = {
    totalPhotos: 69,
    publishedPhotos: 65,
    pendingPhotos: 4,
    totalSales: 487,
    totalRevenue: 18650.00,
    netRevenue: 14920.00, // Après commission 20%
    availableBalance: 8450.00,
    pendingBalance: 6470.00,
    totalViews: 125430,
    totalDownloads: 487,
    totalLikes: 3240,
    followers: 342,
    averageRating: 4.7,
  };

  // Données des ventes par jour (30 derniers jours)
  const salesData = [
    { date: '01/01', sales: 12, revenue: 450 },
    { date: '02/01', sales: 8, revenue: 320 },
    { date: '03/01', sales: 15, revenue: 580 },
    { date: '04/01', sales: 10, revenue: 410 },
    { date: '05/01', sales: 18, revenue: 720 },
    { date: '06/01', sales: 14, revenue: 560 },
    { date: '07/01', sales: 22, revenue: 890 },
    { date: '08/01', sales: 16, revenue: 640 },
    { date: '09/01', sales: 11, revenue: 450 },
    { date: '10/01', sales: 19, revenue: 760 },
    { date: '11/01', sales: 25, revenue: 1020 },
    { date: '12/01', sales: 20, revenue: 800 },
    { date: '13/01', sales: 17, revenue: 680 },
    { date: '14/01', sales: 13, revenue: 520 },
    { date: '15/01', sales: 21, revenue: 840 },
  ];

  // Répartition des ventes par catégorie
  const categoryData = [
    { name: 'Football', value: 280, color: '#22c55e' },
    { name: 'Cyclisme', value: 85, color: '#3b82f6' },
    { name: 'Athlétisme', value: 45, color: '#f59e0b' },
    { name: 'Culture', value: 52, color: '#8b5cf6' },
    { name: 'Autres', value: 25, color: '#6b7280' },
  ];

  // Top 5 photos les plus vendues
  const topPhotos = [
    { id: 1, title: 'Gardien des Étalons avec trophée CAF', sales: 45, revenue: 1800 },
    { id: 2, title: 'Match des Étalons - Action de jeu', sales: 38, revenue: 1520 },
    { id: 3, title: 'Équipe cycliste nationale', sales: 32, revenue: 1280 },
    { id: 4, title: 'Supportrice en costume traditionnel', sales: 29, revenue: 1160 },
    { id: 5, title: 'Portrait joueur Étalons', sales: 26, revenue: 1040 },
  ];

  // Activité récente
  const recentActivity = [
    { type: 'sale', message: '3 photos vendues', time: 'Il y a 2 heures', amount: 120 },
    { type: 'like', message: '12 nouveaux favoris', time: 'Il y a 4 heures' },
    { type: 'follower', message: '5 nouveaux abonnés', time: 'Il y a 6 heures' },
    { type: 'upload', message: 'Photo approuvée: "Match des Étalons"', time: 'Hier' },
    { type: 'sale', message: '2 photos vendues', time: 'Hier', amount: 85 },
  ];

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => setLoading(false), 500);
  }, [timeRange]);

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
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Bienvenue {user?.first_name}, voici votre aperçu
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/photographer/upload">
              <Button>
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Uploader une photo
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Filtres de période */}
      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { value: '7d', label: '7 jours' },
          { value: '30d', label: '30 jours' },
          { value: '90d', label: '90 jours' },
          { value: '1y', label: '1 an' },
        ].map(range => (
          <Button
            key={range.value}
            variant={timeRange === range.value ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setTimeRange(range.value)}
          >
            {range.label}
          </Button>
        ))}
      </div>

      {/* Cartes de statistiques principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Photos */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Photos publiées</p>
              <p className="text-3xl font-bold text-gray-900">{stats.publishedPhotos}</p>
              <p className="text-sm text-gray-500 mt-1">
                {stats.pendingPhotos} en attente
              </p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </Card>

        {/* Total Ventes */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total ventes</p>
              <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.totalSales)}</p>
              <p className="text-sm text-green-600 mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                +12% ce mois
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </Card>

        {/* Revenus */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Revenus nets</p>
              <p className="text-3xl font-bold text-gray-900">{formatPrice(stats.netRevenue)}</p>
              <p className="text-sm text-gray-500 mt-1">
                80% de {formatPrice(stats.totalRevenue)}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        {/* Vues */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Vues totales</p>
              <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.totalViews)}</p>
              <p className="text-sm text-gray-500 mt-1">
                {stats.totalLikes} favoris
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Graphique des ventes */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-6">Ventes et revenus</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#22c55e"
                fillOpacity={1}
                fill="url(#colorRevenue)"
                name="Revenus (€)"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="sales"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Ventes"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Répartition par catégorie */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Ventes par catégorie</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {categoryData.map((cat, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                  <span>{cat.name}</span>
                </div>
                <span className="font-semibold">{cat.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top photos */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Top 5 photos</h3>
            <Link to="/photographer/analytics">
              <Button variant="ghost" size="sm">
                Voir tout
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {topPhotos.map((photo, index) => (
              <div key={photo.id} className="flex items-center gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-primary font-semibold">#{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{photo.title}</p>
                  <p className="text-sm text-gray-600">{photo.sales} ventes</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatPrice(photo.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Activité récente */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Activité récente</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === 'sale' ? 'bg-green-100' :
                  activity.type === 'like' ? 'bg-red-100' :
                  activity.type === 'follower' ? 'bg-blue-100' :
                  'bg-purple-100'
                }`}>
                  {activity.type === 'sale' && (
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  )}
                  {activity.type === 'like' && (
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  )}
                  {activity.type === 'follower' && (
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  )}
                  {activity.type === 'upload' && (
                    <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
                {activity.amount && (
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-600">+{formatPrice(activity.amount)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card className="p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/photographer/upload">
            <button className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left">
              <svg className="w-6 h-6 text-primary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="font-semibold text-gray-900">Uploader des photos</p>
              <p className="text-sm text-gray-600">Ajouter de nouvelles photos</p>
            </button>
          </Link>

          <Link to="/photographer/photos">
            <button className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left">
              <svg className="w-6 h-6 text-primary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="font-semibold text-gray-900">Gérer mes photos</p>
              <p className="text-sm text-gray-600">{stats.totalPhotos} photos</p>
            </button>
          </Link>

          <Link to="/photographer/revenue">
            <button className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left">
              <svg className="w-6 h-6 text-primary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="font-semibold text-gray-900">Mes revenus</p>
              <p className="text-sm text-gray-600">{formatPrice(stats.availableBalance)} disponibles</p>
            </button>
          </Link>

          <Link to="/photographer/analytics">
            <button className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left">
              <svg className="w-6 h-6 text-primary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="font-semibold text-gray-900">Analytics</p>
              <p className="text-sm text-gray-600">Statistiques détaillées</p>
            </button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
