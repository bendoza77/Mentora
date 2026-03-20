import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BrainCircuit, Menu, X } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import LanguageToggle from '../ui/LanguageToggle';
import Button from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';
import clsx from 'clsx';

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      className={clsx(
        'text-sm font-medium transition-colors duration-200',
        active ? 'text-primary-400' : 'text-slate-400 hover:text-white'
      )}
    >
      {children}
    </Link>
  );
};

export default function Navbar() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const HIDE_ROUTES = ['/dashboard', '/tutor', '/exam', '/analytics', '/practice', '/settings',
                       '/about', '/blog', '/careers', '/contact', '/privacy', '/terms',
                       '/login', '/register', '/features', '/how-it-works', '/pricing', '/purchase'];
  const isDashboard = HIDE_ROUTES.some(r => location.pathname.startsWith(r));

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  if (isDashboard) return null;

  return (
    <>
      <nav
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'glass border-b border-primary-500/10 py-3'
            : 'bg-transparent py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className={`${mobileOpen ? "hidden" : "flex"} items-center gap-2.5 group`}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-600/30 group-hover:shadow-primary-600/50 transition-shadow">
                <BrainCircuit size={20} className="text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Mentora <span className="gradient-text">AI</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <NavLink to="/features">{t('nav.features')}</NavLink>
              <NavLink to="/how-it-works">{t('nav.howItWorks')}</NavLink>
              <NavLink to="/pricing">{t('nav.pricing')}</NavLink>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <LanguageToggle />
              <ThemeToggle />
              <Link to="/login">
                <Button variant="ghost" size="sm">{t('nav.signIn')}</Button>
              </Link>
              <Link to="/register">
                <Button variant="gradient" size="sm">{t('nav.getStarted')}</Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 right-0 w-72 h-full bg-dark-surface border-l border-dark-border p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2.5 mt-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center">
                <BrainCircuit size={16} className="text-white" />
              </div>
              <span className="font-bold text-white">Mentora AI</span>
            </div>
            <div className="flex flex-col gap-4 mt-4">
              {[
                { to: '/features', label: t('nav.features') },
                { to: '/how-it-works', label: t('nav.howItWorks') },
                { to: '/pricing', label: t('nav.pricing') },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="text-slate-300 hover:text-white text-base font-medium py-2 border-b border-dark-border"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-3 mt-auto">
              <div className="flex gap-2">
                <LanguageToggle />
                <ThemeToggle />
              </div>
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <Button full variant="secondary">{t('nav.signIn')}</Button>
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)}>
                <Button full variant="gradient">{t('nav.getStarted')}</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
