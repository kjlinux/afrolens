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
  Users,
  DollarSign,
  Calendar,
  TrendingDown,
  Award,
  Clock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { photographerService } from '../../services/api';
import { formatPrice, formatNumber } from '../../utils/helpers';
import { PhotographerGuard } from '../../components/auth';

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
      const data = await photographerService.getAnalytics(period);
      setAnalytics(data);
    } catch (err) {
      console.error('Erreur lors du chargement des analytics:', err);
      setError(err.message || 'Impossible de charger les statistiques');
    } finally {
      setLoading(false);
    }
  };

  // Mock analytics data pour fallback
  const getMockAnalytics = () => {
    return {
        overview: {
          totalViews: 45234,
          viewsChange: 12.5,
          totalDownloads: 3421,
          downloadsChange: 8.3,
          conversionRate: 7.56,
          conversionChange: -2.1,
          avgPhotoPrice: 45.50,
          priceChange: 5.2,
        },
        viewsOverTime: generateTimeSeriesData(period, 'views'),
        salesOverTime: generateTimeSeriesData(period, 'sales'),
        revenueOverTime: generateTimeSeriesData(period, 'revenue'),
        conversionOverTime: generateTimeSeriesData(period, 'conversion'),
        topPhotos: [
          {
            id: 1,
            title: 'Action match Burkina vs Mali',
            views: 2341,
            downloads: 234,
            revenue: 10530,
            conversionRate: 10.0,
          },
          {
            id: 2,
            title: 'Célébration victoire équipe',
            views: 1987,
            downloads: 189,
            revenue: 8505,
            conversionRate: 9.5,
          },
          {
            id: 3,
            title: 'Portrait joueur vedette',
            views: 1654,
            downloads: 142,
            revenue: 6390,
            conversionRate: 8.6,
          },
          {
            id: 4,
            title: 'Supporters dans le stade',
            views: 1432,
            downloads: 128,
            revenue: 5760,
            conversionRate: 8.9,
          },
          {
            id: 5,
            title: 'Entraînement matinal',
            views: 1201,
            downloads: 98,
            revenue: 4410,
            conversionRate: 8.2,
          },
        ],
        categoryPerformance: [
          { name: 'Matchs', photos: 145, views: 18234, sales: 1234, revenue: 55530 },
          { name: 'Portraits', photos: 89, views: 12456, sales: 892, revenue: 40140 },
          { name: 'Entraînements', photos: 67, views: 8932, sales: 567, revenue: 25515 },
          { name: 'Célébrations', photos: 54, views: 5612, sales: 456, revenue: 20520 },
          { name: 'Coulisses', photos: 32, views: 3421, sales: 272, revenue: 12240 },
        ],
        revenueByCategory: [
          { name: 'Matchs', value: 55530 },
          { name: 'Portraits', value: 40140 },
          { name: 'Entraînements', value: 25515 },
          { name: 'Célébrations', value: 20520 },
          { name: 'Coulisses', value: 12240 },
        ],
        audienceInsights: {
          totalCustomers: 892,
          returningCustomers: 234,
          returningRate: 26.2,
          avgPhotosPerCustomer: 3.8,
          topCustomers: [
            { id: 1, name: 'Amadou Traoré', purchases: 45, totalSpent: 2025 },
            { id: 2, name: 'Fatou Ouédraogo', purchases: 38, totalSpent: 1710 },
            { id: 3, name: 'Ibrahim Kaboré', purchases: 32, totalSpent: 1440 },
            { id: 4, name: 'Awa Sawadogo', purchases: 28, totalSpent: 1260 },
            { id: 5, name: 'Boureima Zongo', purchases: 24, totalSpent: 1080 },
          ],
        },
        hourlyDistribution: generateHourlyData(),
      };
  };

  // Generate time series data based on period
  function generateTimeSeriesData(period, type) {
    const dataPoints = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
    const data = [];

    for (let i = dataPoints - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const baseValue = type === 'views' ? 1500 : type === 'sales' ? 120 : type === 'revenue' ? 5400 : 7.5;
      const randomFactor = 0.7 + Math.random() * 0.6;
      const trendFactor = 1 + (dataPoints - i) / dataPoints * 0.3;

      data.push({
        date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        value: Math.round(baseValue * randomFactor * trendFactor),
      });
    }

    return data;
  }

  // Generate hourly distribution data
  function generateHourlyData() {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      const baseViews = i >= 8 && i <= 22 ? 800 : 200;
      const baseSales = i >= 8 && i <= 22 ? 60 : 15;

      hours.push({
        hour: `${i}h`,
        views: Math.round(baseViews * (0.8 + Math.random() * 0.4)),
        sales: Math.round(baseSales * (0.8 + Math.random() * 0.4)),
      });
    }
    return hours;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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

  const { overview, topPhotos, categoryPerformance, revenueByCategory, audienceInsights } = analytics;

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
                {categoryPerformance.map((category, index) => (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Revenue by Category Pie Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Répartition du CA par catégorie</h2>
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
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
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

      {/* Audience Insights */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Insights clients
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total clients</p>
            <p className="text-2xl font-bold text-blue-600">{formatNumber(audienceInsights.totalCustomers)}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Clients récurrents</p>
            <p className="text-2xl font-bold text-green-600">{formatNumber(audienceInsights.returningCustomers)}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Taux de fidélité</p>
            <p className="text-2xl font-bold text-purple-600">{audienceInsights.returningRate}%</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Photos/client</p>
            <p className="text-2xl font-bold text-orange-600">{audienceInsights.avgPhotosPerCustomer}</p>
          </div>
        </div>

        <h3 className="font-semibold mb-3">Top 5 meilleurs clients</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-2 text-sm font-medium text-gray-700">Client</th>
                <th className="text-right py-2 px-2 text-sm font-medium text-gray-700">Achats</th>
                <th className="text-right py-2 px-2 text-sm font-medium text-gray-700">Total dépensé</th>
              </tr>
            </thead>
            <tbody>
              {audienceInsights.topCustomers.map((customer, index) => (
                <tr key={customer.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="font-medium">{customer.name}</span>
                    </div>
                  </td>
                  <td className="text-right py-3 px-2 text-gray-600">{customer.purchases}</td>
                  <td className="text-right py-3 px-2 font-medium">{formatPrice(customer.totalSpent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
