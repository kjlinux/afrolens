import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './contexts/ToastContext';
import { ToastContainer } from './components/common/Toast';
import { PHOTOGRAPHER_STATUS } from './utils/permissions';

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
import About from './pages/About';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Photographers from './pages/Photographers';
import Categories from './pages/Categories';
import Forbidden from './pages/Forbidden';

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
import PublicProfile from './pages/photographer/PublicProfile';
import PendingApproval from './pages/photographer/PendingApproval';
import RejectedStatus from './pages/photographer/RejectedStatus';
import SuspendedAccount from './pages/photographer/SuspendedAccount';

// Pages admin
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminModeration from './pages/admin/Moderation';
import AdminPhotographersPending from './pages/admin/PhotographersPending';
import AdminWithdrawals from './pages/admin/Withdrawals';

// Component pour routes protégées (amélioré avec support permissions et statut photographe)
const ProtectedRoute = ({
  children,
  requiredRole,
  requirePermission,
  requireApproval = false
}) => {
  const {
    user,
    isAuthenticated,
    loading,
    hasRole,
    hasPermission,
    isApprovedPhotographer,
    getPhotographerStatus
  } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/forbidden" replace />;
  }

  // Check permission requirement
  if (requirePermission && !hasPermission(requirePermission)) {
    return <Navigate to="/forbidden" replace />;
  }

  // Check photographer approval requirement
  if (requireApproval && hasRole('photographer')) {
    const status = getPhotographerStatus();

    if (status === PHOTOGRAPHER_STATUS.PENDING) {
      return <Navigate to="/photographer/pending" replace />;
    }

    if (status === PHOTOGRAPHER_STATUS.REJECTED) {
      return <Navigate to="/photographer/rejected" replace />;
    }

    if (status === PHOTOGRAPHER_STATUS.SUSPENDED) {
      return <Navigate to="/photographer/suspended" replace />;
    }

    if (!isApprovedPhotographer()) {
      return <Navigate to="/photographer/pending" replace />;
    }
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
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/photographers" element={<Photographers />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/photographer/:photographerId" element={<PublicProfile />} />
          <Route path="/forbidden" element={<Forbidden />} />

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

          {/* Routes photographe - Status pages (no approval required) */}
          <Route
            path="/photographer/pending"
            element={
              <ProtectedRoute requiredRole="photographer">
                <PendingApproval />
              </ProtectedRoute>
            }
          />
          <Route
            path="/photographer/rejected"
            element={
              <ProtectedRoute requiredRole="photographer">
                <RejectedStatus />
              </ProtectedRoute>
            }
          />
          <Route
            path="/photographer/suspended"
            element={
              <ProtectedRoute requiredRole="photographer">
                <SuspendedAccount />
              </ProtectedRoute>
            }
          />

          {/* Routes photographe - Require approval */}
          <Route
            path="/photographer/dashboard"
            element={
              <ProtectedRoute requiredRole="photographer" requireApproval={true}>
                <PhotographerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/photographer/photos"
            element={
              <ProtectedRoute requiredRole="photographer" requireApproval={true}>
                <PhotographerPhotos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/photographer/upload"
            element={
              <ProtectedRoute requiredRole="photographer" requireApproval={true}>
                <PhotographerUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/photographer/revenue"
            element={
              <ProtectedRoute requiredRole="photographer" requireApproval={true}>
                <PhotographerRevenue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/photographer/analytics"
            element={
              <ProtectedRoute requiredRole="photographer" requireApproval={true}>
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
