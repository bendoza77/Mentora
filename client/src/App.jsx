import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Suspense } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import AITutor from './pages/AITutor';
import ExamSim from './pages/ExamSim';
import Analytics from './pages/Analytics';
import Practice from './pages/Practice';
import Settings from './pages/Settings';
import Register from './pages/Register';
import Login from './pages/Login';
import About from './pages/static/About';
import Blog from './pages/static/Blog';
import Careers from './pages/static/Careers';
import Contact from './pages/static/Contact';
import Privacy from './pages/static/Privacy';
import Terms from './pages/static/Terms';
import Features from './pages/Features';
import HowItWorksPage from './pages/HowItWorksPage';
import PricingPage from './pages/PricingPage';
import Purchase from './pages/Purchase';
import './i18n';

const APP_ROUTES = ['/dashboard', '/tutor', '/exam', '/analytics', '/practice', '/settings'];
const GUEST_ROUTES = ['/', '/login', '/register'];

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen bg-dark-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center animate-pulse-glow">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-sm text-slate-500 animate-pulse">Loading Mentora AI...</p>
      </div>
    </div>
  );
}

function AppShell() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const isAppPage = APP_ROUTES.some(r => location.pathname.startsWith(r));

  const isGuestRoute = GUEST_ROUTES.includes(location.pathname);

  // Session still loading — show spinner on routes that will redirect
  if (isAuthenticated === null && (isAppPage || isGuestRoute)) {
    return <LoadingSpinner />;
  }

  // Authenticated user on guest-only route → send to dashboard
  if (isAuthenticated === true && isGuestRoute) {
    return <Navigate to="/dashboard" replace />;
  }

  // Guard: unauthenticated users trying to access app pages → /login
  if (isAppPage && isAuthenticated === false) {
    return <Navigate to="/login" replace />;
  }

  // Auth pages — full-screen, no navbar
  if (location.pathname === '/login' || location.pathname === '/register') {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  if (!isAppPage) {
    return (
      <>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/features" element={<Features />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/purchase" element={<Purchase />} />
        </Routes>
      </>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-dark-bg">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tutor" element={<AITutor />} />
            <Route path="/exam" element={<ExamSim />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppShell />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
