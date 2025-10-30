import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './contexts/ToastContext';
import { ToastContainer } from './components/common/Toast';

// Layouts
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/ScrollToTop';

// Pages publiques
import Home from './pages/Home';
import Search from './pages/Search';
import PhotoDetail from './pages/PhotoDetail';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Pages utilisateur
import Profile from './pages/user/Profile';
import Cart from './pages/user/Cart';
import Checkout from './pages/user/Checkout';
import Orders from './pages/user/Orders';
import Favorites from './pages/user/Favorites';

// Pages photographe
import PhotographerDashboard from './pages/photographer/Dashboard';
import PhotographerPhotos from './pages/photographer/MyPhotos';
import PhotographerUpload from './pages/photographer/Upload';
import PhotographerRevenue from './pages/photographer/Revenue';
import PhotographerAnalytics from './pages/photographer/Analytics';

// Pages admin
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminModeration from './pages/admin/Moderation';
import AdminPhotographersPending from './pages/admin/PhotographersPending';
import AdminWithdrawals from './pages/admin/Withdrawals';

// Component pour routes protégées
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.account_type !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ScrollToTop />
      <ToastContainer />
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/photo/:id" element={<PhotoDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Routes utilisateur (buyer/photographer) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />

          {/* Routes photographe */}
          <Route
            path="/photographer/dashboard"
            element={
              <ProtectedRoute requiredRole="photographer">
                <PhotographerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/photographer/photos"
            element={
              <ProtectedRoute requiredRole="photographer">
                <PhotographerPhotos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/photographer/upload"
            element={
              <ProtectedRoute requiredRole="photographer">
                <PhotographerUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/photographer/revenue"
            element={
              <ProtectedRoute requiredRole="photographer">
                <PhotographerRevenue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/photographer/analytics"
            element={
              <ProtectedRoute requiredRole="photographer">
                <PhotographerAnalytics />
              </ProtectedRoute>
            }
          />

          {/* Routes admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/moderation"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminModeration />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/photographers-pending"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPhotographersPending />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/withdrawals"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminWithdrawals />
              </ProtectedRoute>
            }
          />

          {/* Route 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
