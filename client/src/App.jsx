import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import { ExamProvider } from './context/ExamContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import CursorFollower from './components/ui/CursorFollower';
import { BrainCircuit } from 'lucide-react';
import './i18n';

// Lazy-loaded pages — each becomes its own JS chunk, only fetched when needed
const Landing        = lazy(() => import('./pages/Landing'));
const Dashboard      = lazy(() => import('./pages/Dashboard'));
const AITutor        = lazy(() => import('./pages/AITutor'));
const ExamSim        = lazy(() => import('./pages/ExamSim'));
const Analytics      = lazy(() => import('./pages/Analytics'));
const Practice       = lazy(() => import('./pages/Practice'));
const Settings       = lazy(() => import('./pages/Settings'));
const Login          = lazy(() => import('./pages/Login'));
const Register       = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword  = lazy(() => import('./pages/ResetPassword'));
const About          = lazy(() => import('./pages/static/About'));
const Blog           = lazy(() => import('./pages/static/Blog'));
const Careers        = lazy(() => import('./pages/static/Careers'));
const Contact        = lazy(() => import('./pages/static/Contact'));
const Privacy        = lazy(() => import('./pages/static/Privacy'));
const Terms          = lazy(() => import('./pages/static/Terms'));
const Features       = lazy(() => import('./pages/Features'));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'));
const PricingPage    = lazy(() => import('./pages/PricingPage'));
const Purchase       = lazy(() => import('./pages/Purchase'));

const APP_ROUTES        = ['/dashboard', '/tutor', '/exam', '/analytics', '/practice', '/settings'];
const GUEST_ROUTES      = ['/', '/login', '/register'];
// Routes where we must wait for auth before rendering (to avoid flash-of-wrong-page)
const AUTH_GATED_ROUTES = ['/login', '/register'];

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

// ExamSim wrapped with its own provider — keeps ExamContext off every other page
function ExamRoute() {
  return (
    <ExamProvider>
      <ExamSim />
    </ExamProvider>
  );
}

function AppShell() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const isAppPage   = APP_ROUTES.some(r => location.pathname.startsWith(r));
  const isGuestRoute = GUEST_ROUTES.includes(location.pathname);

  const isAuthGated = AUTH_GATED_ROUTES.includes(location.pathname);

  // Auth still resolving — only block routes where wrong render = bad UX
  // (app pages need auth check; /login+/register would flash then redirect)
  // Landing page (/) renders immediately — no spinner for public visitors
  if (isAuthenticated === null && (isAppPage || isAuthGated)) {
    return <LoadingSpinner />;
  }

  // Authenticated user on login/register → dashboard (/ can show landing briefly)
  if (isAuthenticated === true && isGuestRoute) {
    return <Navigate to="/dashboard" replace />;
  }

  // Unauthenticated user trying to reach app pages → login
  if (isAppPage && isAuthenticated === false) {
    return <Navigate to="/login" replace />;
  }

  // Full-screen auth pages — no navbar/sidebar
  if (['/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname)) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/login"           element={<Login />} />
          <Route path="/register"        element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password"  element={<ResetPassword />} />
        </Routes>
      </Suspense>
    );
  }

  // Marketing / static pages
  if (!isAppPage) {
    return (
      <>
        <Navbar />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/"            element={<Landing />} />
            <Route path="/about"       element={<About />} />
            <Route path="/blog"        element={<Blog />} />
            <Route path="/careers"     element={<Careers />} />
            <Route path="/contact"     element={<Contact />} />
            <Route path="/privacy"     element={<Privacy />} />
            <Route path="/terms"       element={<Terms />} />
            <Route path="/features"    element={<Features />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/pricing"     element={<PricingPage />} />
            <Route path="/purchase"    element={<Purchase />} />
          </Routes>
        </Suspense>
      </>
    );
  }

  // Authenticated app shell
  return (
    <div className="flex h-screen overflow-hidden bg-dark-bg">
      <Sidebar />
      {/* pb-14 md:pb-0 reserves space for the mobile bottom nav (56px) */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden pb-14 md:pb-0">
        {/* Main logo — shown when sidebar is open, hidden when collapsed */}
        <div className="main-logo hidden md:flex items-center gap-2.5 px-5 py-3 border-b border-dark-border bg-dark-surface shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-sm shadow-primary-600/30">
            <BrainCircuit size={15} className="text-white" />
          </div>
          <span className="font-bold text-white text-sm leading-none">
            Mentora <span className="gradient-text">AI</span>
          </span>
        </div>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tutor"     element={<AITutor />} />
            <Route path="/exam"      element={<ExamRoute />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/practice"  element={<Practice />} />
            <Route path="/settings"  element={<Settings />} />
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
          <CursorFollower />
          <AppShell />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
