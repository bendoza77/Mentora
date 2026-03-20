import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import {
  BrainCircuit, LayoutDashboard, MessageSquare, ClipboardCheck,
  BarChart3, BookOpen, Settings, LogOut, ChevronRight,
  Zap, Crown,
} from 'lucide-react';
import Badge from '../ui/Badge';
import clsx from 'clsx';
import ThemeToggle from '../ui/ThemeToggle';
import LanguageToggle from '../ui/LanguageToggle';

const NAV_ITEMS = (t) => [
  { to: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
  { to: '/tutor',     icon: MessageSquare,   label: t('nav.aiTutor'),  badge: 'AI' },
  { to: '/exam',      icon: ClipboardCheck,  label: t('nav.examSim') },
  { to: '/analytics', icon: BarChart3,       label: t('nav.analytics') },
  { to: '/practice',  icon: BookOpen,        label: t('nav.practice') },
];

const BOTTOM_ITEMS = (t) => [
  { to: '/settings', icon: Settings, label: t('nav.settings') },
];

export default function Sidebar() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (to) => location.pathname === to;
  const planColors = { free: 'ghost', pro: 'primary', premium: 'warning' };
  const allMobileItems = [...NAV_ITEMS(t), ...BOTTOM_ITEMS(t)];

  // Broadcast collapsed state to the document root so other elements can react via CSS
  useEffect(() => {
    document.documentElement.dataset.sidebar = collapsed ? 'collapsed' : 'open';
    return () => { delete document.documentElement.dataset.sidebar; };
  }, [collapsed]);

  return (
    <>
      {/* ═══════════════════════════════════════════
          DESKTOP SIDEBAR
          ═══════════════════════════════════════════ */}
      <aside
        style={{ transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)' }}
        className={clsx(
          'hidden md:flex flex-col h-screen bg-dark-surface border-r border-dark-border sticky top-0 z-30 overflow-hidden',
          collapsed ? 'w-[72px]' : 'w-64'
        )}
      >
        {/* ── Logo — visible only when collapsed ── */}
        <div
          className="flex items-center justify-center border-b border-dark-border overflow-hidden"
          style={{
            maxHeight:  collapsed ? '72px'  : '0px',
            opacity:    collapsed ? 1       : 0,
            padding:    collapsed ? '1rem'  : '0',
            borderBottomWidth: collapsed ? '1px' : '0px',
            transition: 'max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease, padding 0.3s ease, border-bottom-width 0.3s ease',
          }}
        >
          <div
            className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500
                       flex items-center justify-center shadow-md shadow-primary-600/30
                       animate-pulse-glow transition-transform duration-200 hover:scale-105"
          >
            <BrainCircuit size={20} className="text-white" />
          </div>
        </div>

        {/* ── Main nav ── */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto overflow-x-hidden">
          {NAV_ITEMS(t).map(({ to, icon: Icon, label, badge }, i) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                className="sidebar-item group relative flex items-center gap-3 rounded-xl text-sm font-medium
                           transition-colors duration-150 overflow-hidden"
                style={{
                  animationDelay: `${i * 40}ms`,
                  padding: collapsed ? '0.625rem 0' : '0.625rem 0.75rem',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  background: active ? 'rgba(124,58,237,0.15)' : 'transparent',
                  border: active ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
                  boxShadow: active ? '0 0 12px rgba(124,58,237,0.08)' : 'none',
                  transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s, padding 0.3s cubic-bezier(0.4,0,0.2,1)',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                {/* Active left accent bar */}
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 bg-primary-400 rounded-r-full"
                  style={{
                    height:     active ? '60%'  : '0%',
                    opacity:    active ? 1      : 0,
                    transition: 'height 0.25s ease, opacity 0.2s ease',
                  }}
                />

                {/* Icon */}
                <Icon
                  size={18}
                  className="shrink-0 transition-all duration-200 group-hover:scale-110"
                  style={{ color: active ? '#a78bfa' : '#64748b' }}
                />

                {/* Label */}
                <span
                  className="whitespace-nowrap overflow-hidden font-medium"
                  style={{
                    maxWidth:   collapsed ? '0px'   : '140px',
                    opacity:    collapsed ? 0       : 1,
                    color:      active    ? '#c4b5fd' : '#94a3b8',
                    transition: 'max-width 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.15s ease',
                  }}
                >
                  {label}
                </span>

                {/* Badge */}
                {badge && (
                  <span
                    className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-primary-600/30 text-primary-300 whitespace-nowrap overflow-hidden shrink-0"
                    style={{
                      maxWidth:   collapsed ? '0px'   : '40px',
                      opacity:    collapsed ? 0       : 1,
                      padding:    collapsed ? '0'     : undefined,
                      transition: 'max-width 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.15s ease',
                    }}
                  >
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Bottom section ── */}
        <div className="border-t border-dark-border px-3 py-4 flex flex-col gap-1 overflow-hidden">

          {/* Settings link */}
          {BOTTOM_ITEMS(t).map(({ to, icon: Icon, label }, i) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                className="sidebar-item group flex items-center gap-3 rounded-xl text-sm font-medium
                           transition-colors duration-150 overflow-hidden"
                style={{
                  animationDelay: `${(NAV_ITEMS(t).length + i) * 40}ms`,
                  padding: collapsed ? '0.625rem 0' : '0.625rem 0.75rem',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  background: active ? 'rgba(124,58,237,0.12)' : 'transparent',
                  transition: 'background 0.2s, padding 0.3s cubic-bezier(0.4,0,0.2,1)',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? 'rgba(124,58,237,0.12)' : 'transparent'; }}
              >
                <Icon
                  size={18}
                  className="shrink-0 transition-transform duration-200 group-hover:scale-110"
                  style={{ color: active ? '#a78bfa' : '#64748b' }}
                />
                <span
                  className="whitespace-nowrap overflow-hidden"
                  style={{
                    maxWidth:   collapsed ? '0px'   : '140px',
                    opacity:    collapsed ? 0       : 1,
                    color:      active    ? '#c4b5fd' : '#94a3b8',
                    transition: 'max-width 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.15s ease',
                  }}
                >
                  {label}
                </span>
              </Link>
            );
          })}

          {/* Theme + Language toggles */}
          <div
            className="flex gap-2 px-3 overflow-hidden"
            style={{
              maxHeight:  collapsed ? '0px'  : '48px',
              opacity:    collapsed ? 0      : 1,
              marginTop:  collapsed ? '0'    : '0.5rem',
              transition: 'max-height 0.3s ease, opacity 0.2s ease, margin 0.3s ease',
            }}
          >
            <ThemeToggle />
            <LanguageToggle />
          </div>

          {/* User card */}
          <div
            className="flex items-center gap-3 mt-3 rounded-xl bg-dark-card border border-dark-border overflow-hidden"
            style={{
              padding:    collapsed ? '0.625rem 0' : '0.625rem 0.75rem',
              justifyContent: collapsed ? 'center' : 'flex-start',
              transition: 'padding 0.3s cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            {user?.avatar?.url ? (
              <img src={user.avatar.url} alt="avatar"
                className="w-8 h-8 rounded-full object-cover shrink-0 transition-transform duration-200 hover:scale-105" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500
                              flex items-center justify-center text-white text-xs font-bold shrink-0
                              transition-transform duration-200 hover:scale-105">
                {user?.fullname?.[0]?.toUpperCase() || 'U'}
              </div>
            )}

            <div
              className="flex-1 min-w-0 overflow-hidden"
              style={{
                maxWidth:   collapsed ? '0px'   : '160px',
                opacity:    collapsed ? 0       : 1,
                transition: 'max-width 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.15s ease',
              }}
            >
              <p className="text-sm font-semibold text-white truncate">{user?.fullname}</p>
              <div className="flex items-center gap-1 mt-0.5">
                {user?.plan === 'premium' ? <Crown size={10} className="text-amber-400" /> :
                 user?.plan === 'pro'     ? <Zap   size={10} className="text-primary-400" /> : null}
                <Badge variant={planColors[user?.plan] || 'ghost'} className="capitalize text-[10px] py-0">
                  {user?.plan}
                </Badge>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="text-slate-500 hover:text-red-400 transition-colors duration-150 shrink-0 overflow-hidden"
              style={{
                maxWidth:   collapsed ? '0px'   : '24px',
                opacity:    collapsed ? 0       : 1,
                transition: 'max-width 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.15s ease',
              }}
            >
              <LogOut size={15} />
            </button>
          </div>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full mt-2 py-2 rounded-xl
                       text-slate-500 hover:text-white hover:bg-white/5
                       transition-colors duration-150 text-xs gap-1 group overflow-hidden"
          >
            {/* Single arrow that rotates 180° */}
            <ChevronRight
              size={16}
              className="transition-transform duration-300 group-hover:text-primary-400"
              style={{ transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)' }}
            />
            <span
              className="whitespace-nowrap overflow-hidden"
              style={{
                maxWidth:   collapsed ? '0px'   : '80px',
                opacity:    collapsed ? 0       : 1,
                transition: 'max-width 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.15s ease',
              }}
            >
              Collapse
            </span>
          </button>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════
          MOBILE BOTTOM NAV
          ═══════════════════════════════════════════ */}
      <nav className="mobile-nav-enter md:hidden fixed bottom-0 left-0 right-0 z-50
                      bg-dark-surface/95 backdrop-blur-md border-t border-dark-border
                      flex items-stretch">
        {allMobileItems.map(({ to, icon: Icon, label }) => {
          const active = isActive(to);
          return (
            <Link
              key={to}
              to={to}
              className="relative flex-1 flex flex-col items-center justify-center gap-0.5
                         py-2 px-1 min-h-[56px] transition-colors duration-150"
              style={{ color: active ? '#a78bfa' : '#475569' }}
            >
              {/* Active background pill */}
              <span
                className="absolute inset-x-1.5 inset-y-1 rounded-xl"
                style={{
                  background: active ? 'rgba(124,58,237,0.12)' : 'transparent',
                  transition: 'background 0.25s ease',
                }}
              />

              {/* Icon */}
              <Icon
                size={20}
                strokeWidth={active ? 2.5 : 1.8}
                className="relative z-10 transition-transform duration-200"
                style={{ transform: active ? 'scale(1.15) translateY(-1px)' : 'scale(1)' }}
              />

              {/* Label */}
              <span
                className="relative z-10 text-[10px] font-medium leading-none transition-all duration-200"
                style={{ color: active ? '#a78bfa' : '#475569' }}
              >
                {label}
              </span>

              {/* Top pip indicator */}
              <span
                className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 rounded-b-full bg-primary-400"
                style={{
                  width:      active ? '24px'  : '0px',
                  opacity:    active ? 1       : 0,
                  transition: 'width 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease',
                }}
              />
            </Link>
          );
        })}
      </nav>
    </>
  );
}
