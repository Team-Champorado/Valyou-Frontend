import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { BottomTabBar } from './components/BottomTabBar';
import { Welcome } from './pages/Welcome';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Properties } from './pages/Properties';
import { ValuationStep1 } from './pages/ValuationStep1';
import { ValuationStep2 } from './pages/ValuationStep2';
import { ValuationStep3 } from './pages/ValuationStep3';
import { ValuationResult } from './pages/ValuationResult';
import { Account } from './pages/Account';
import { Settings } from './pages/Settings';
import { Footer } from './components/Footer';

// Layout with conditional Navigation based on route and auth status
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Always hide navigation on login and welcome screens, or if unauthenticated
  const isAuthScreen = location.pathname === '/login' || location.pathname === '/welcome';
  const showNav = isAuthenticated && !isAuthScreen;

  return (
    <div className="min-h-screen flex flex-col bg-background-main font-sans selection:bg-primary-pastel selection:text-primary">
      {showNav && <Navbar />}
      <main className="flex-1">{children}</main>
      <Footer />
      {showNav && <BottomTabBar />}
    </div>
  );
};

// Component to dynamically direct the root "/" path
const RootRedirect: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return null;
  }
  
  // Present login screen first if not authenticated, otherwise dashboard
  return <Navigate to={isAuthenticated ? '/home' : '/login'} replace />;
};

export function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/welcome" element={<Welcome />} />

            {/* Protected Core App Routes */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/properties"
              element={
                <ProtectedRoute>
                  <Properties />
                </ProtectedRoute>
              }
            />
            <Route path="/valuation" element={<Navigate to="/valuation/step1" replace />} />
            <Route
              path="/valuation/step1"
              element={
                <ProtectedRoute>
                  <ValuationStep1 />
                </ProtectedRoute>
              }
            />
            <Route
              path="/valuation/step2"
              element={
                <ProtectedRoute>
                  <ValuationStep2 />
                </ProtectedRoute>
              }
            />
            <Route
              path="/valuation/step3"
              element={
                <ProtectedRoute>
                  <ValuationStep3 />
                </ProtectedRoute>
              }
            />
            <Route
              path="/valuation/result"
              element={
                <ProtectedRoute>
                  <ValuationResult />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* Default entry point: Present login first for unauthenticated users */}
            <Route path="/" element={<RootRedirect />} />
            
            {/* Fallback */}
            <Route path="*" element={<RootRedirect />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
