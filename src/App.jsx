import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Inbox from './pages/Inbox';
import Calendar from './pages/Calendar';
import Leads from './pages/Leads';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Landing from './pages/Landing';

// Loading spinner
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-bounce">🦊</div>
        <p className="text-stone-600">Loading...</p>
      </div>
    </div>
  );
}

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, business } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If no business setup, redirect to onboarding
  if (!business) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return children;
}

// Public route wrapper (redirect to dashboard if already logged in)
function PublicRoute({ children }) {
  const { isAuthenticated, loading, business } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (isAuthenticated) {
    if (!business) {
      return <Navigate to="/onboarding" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

// Onboarding route (must be logged in but no full setup required)
function OnboardingRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function AppRoutes() {
  const { isAuthenticated, loading, business } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Landing page - show to non-authenticated users */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            business ? <Navigate to="/dashboard" replace /> : <Navigate to="/onboarding" replace />
          ) : (
            <Landing />
          )
        }
      />

      {/* Public routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />
      
      {/* Onboarding */}
      <Route
        path="/onboarding"
        element={
          <OnboardingRoute>
            <Onboarding />
          </OnboardingRoute>
        }
      />
      
      {/* Protected routes - Dashboard layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="inbox" element={<Inbox />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="leads" element={<Leads />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Legacy routes - redirect to new structure */}
      <Route path="/inbox" element={<Navigate to="/dashboard/inbox" replace />} />
      <Route path="/calendar" element={<Navigate to="/dashboard/calendar" replace />} />
      <Route path="/leads" element={<Navigate to="/dashboard/leads" replace />} />
      <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
