import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  Eye,
  Download,
  ShoppingCart,
  DollarSign,
  TrendingDown,
  Award,
  Clock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAnalytics } from '../../services/photographerService';
import { formatPrice, formatNumber } from '../../utils/helpers';
import { PhotographerGuard } from '../../components/auth';
import Spinner from '../../components/common/Spinner';

// Period filter options
const PERIODS = [
  { value: '7d', label: '7 derniers jours' },
  { value: '30d', label: '30 derniers jours' },
  { value: '90d', label: '90 derniers jours' },
  { value: '1y', label: '1 an' },
  { value: 'all', label: 'Tout' },
];

// Chart colors
const COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
};

const CATEGORY_COLORS = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4'];

const Analytics = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('30d');
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAnalytics(period);
      setAnalytics(data);
    } catch (err) {
      console.error('Erreur lors du chargement des analytics:', err);
      setError(err.message || 'Impossible de charger les statistiques');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Impossible de charger les analytics</p>
      </div>
    );
  }

  const { overview, topPhotos, categoryPerformance, revenueByCategory } = analytics;

  return (
    <PhotographerGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1">Analysez les performances de vos photos</p>
        </div>

        {/* Period Filter */}
        <div className="flex gap-2">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                period === p.value
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Vues totales"
          value={formatNumber(overview.totalViews)}
          change={overview.viewsChange}
          icon={Eye}
          color="blue"
        />
        <StatCard
          title="Téléchargements"
          value={formatNumber(overview.totalDownloads)}
          change={overview.downloadsChange}
          icon={Download}
          color="green"
        />
        <StatCard
          title="Taux de conversion"
          value={`${overview.conversionRate}%`}
          change={overview.conversionChange}
          icon={ShoppingCart}
          color="purple"
        />
        <StatCard
          title="Prix moyen"
          value={formatPrice(overview.avgPhotoPrice)}
          change={overview.priceChange}
          icon={DollarSign}
          color="orange"
        />
      </div>

      {/* Views Over Time */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Évolution des vues
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={analytics.viewsOverTime}>
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke={COLORS.primary}
              fill="url(#colorViews)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Sales and Revenue Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Over Time */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Évolution des ventes
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analytics.salesOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke={COLORS.success}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Over Time */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Évolution du chiffre d'affaires
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={analytics.revenueOverTime}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.success} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => formatPrice(value)} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={COLORS.success}
                fill="url(#colorRevenue)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Conversion Rate Over Time */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Taux de conversion
        </h2>
        {analytics.conversionOverTime && analytics.conversionOverTime.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analytics.conversionOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `${value}%`} />
              <Line
                type="monotone"
                dataKey="value"
                stroke={COLORS.secondary}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[250px] text-gray-500">
            Aucune donnée de taux de conversion disponible
          </div>
        )}
      </div>

      {/* Category Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Category Performance Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Performance par catégorie</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2 text-sm font-medium text-gray-700">Catégorie</th>
                  <th className="text-right py-2 px-2 text-sm font-medium text-gray-700">Photos</th>
                  <th className="text-right py-2 px-2 text-sm font-medium text-gray-700">Vues</th>
                  <th className="text-right py-2 px-2 text-sm font-medium text-gray-700">Ventes</th>
                  <th className="text-right py-2 px-2 text-sm font-medium text-gray-700">CA</th>
                </tr>
              </thead>
              <tbody>
                {categoryPerformance && categoryPerformance.length > 0 ? (
                  categoryPerformance.map((category, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
                          />
                          <span className="font-medium">{category.name}</span>
                        </div>
                      </td>
                      <td className="text-right py-3 px-2 text-gray-600">{category.photos}</td>
                      <td className="text-right py-3 px-2 text-gray-600">{formatNumber(category.views)}</td>
                      <td className="text-right py-3 px-2 text-gray-600">{formatNumber(category.sales)}</td>
                      <td className="text-right py-3 px-2 font-medium">{formatPrice(category.revenue)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      Aucune donnée de catégorie disponible
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Revenue by Category Pie Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Répartition du CA par catégorie</h2>
          {revenueByCategory && revenueByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {revenueByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatPrice(value)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              Aucune donnée de revenus par catégorie disponible
            </div>
          )}
        </div>
      </div>

      {/* Top Photos */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5" />
          Top 5 des photos
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-2 text-sm font-medium text-gray-700">Titre</th>
                <th className="text-right py-2 px-2 text-sm font-medium text-gray-700">Vues</th>
                <th className="text-right py-2 px-2 text-sm font-medium text-gray-700">Téléchargements</th>
                <th className="text-right py-2 px-2 text-sm font-medium text-gray-700">Conversion</th>
                <th className="text-right py-2 px-2 text-sm font-medium text-gray-700">Revenus</th>
              </tr>
            </thead>
            <tbody>
              {topPhotos.map((photo, index) => (
                <tr key={photo.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="font-medium">{photo.title}</span>
                    </div>
                  </td>
                  <td className="text-right py-3 px-2 text-gray-600">{formatNumber(photo.views)}</td>
                  <td className="text-right py-3 px-2 text-gray-600">{formatNumber(photo.downloads)}</td>
                  <td className="text-right py-3 px-2">
                    <span className="text-green-600 font-medium">{photo.conversionRate.toFixed(1)}%</span>
                  </td>
                  <td className="text-right py-3 px-2 font-medium">{formatPrice(photo.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hourly Distribution */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Distribution horaire de l'activité
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.hourlyDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis yAxisId="left" orientation="left" stroke={COLORS.primary} />
            <YAxis yAxisId="right" orientation="right" stroke={COLORS.success} />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="views" fill={COLORS.primary} name="Vues" />
            <Bar yAxisId="right" dataKey="sales" fill={COLORS.success} name="Ventes" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      </div>
    </PhotographerGuard>
  );
};

// Stat Card Component
const StatCard = ({ title, value, change, icon: Icon, color }) => {
  const isPositive = change >= 0;
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {Math.abs(change).toFixed(1)}%
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

export default Analytics;
