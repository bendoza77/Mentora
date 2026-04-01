import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import {
  BrainCircuit, LayoutDashboard, MessageSquare, ClipboardCheck,
  BarChart3, BookOpen, Settings, LogOut,
  ChevronLeft, ChevronRight, Zap, Crown,
} from 'lucide-react';
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

const PLAN_ICON  = { pro: Zap, premium: Crown };
const PLAN_COLOR = { pro: 'text-primary-400', premium: 'text-amber-400' };
const PLAN_LABEL = { free: 'Free', pro: 'Pro', premium: 'Premium' };

/* Tooltip that appears to the right of an icon when sidebar is collapsed */
function Tooltip({ label, children }) {
  const [visible, setVisible] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 pointer-events-none">
          <div className="flex items-center gap-0">
            {/* Arrow */}
            <div className="w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-dark-card" />
            <div className="px-3 py-1.5 bg-dark-card border border-dark-border rounded-xl shadow-xl
                            text-xs font-semibold text-white whitespace-nowrap">
              {label}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const { t }            = useTranslation();
  const { user, logout } = useAuth();
  const location         = useLocation();
  const navigate         = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive     = (to) => location.pathname === to;
  const allMobile    = [...NAV_ITEMS(t), ...BOTTOM_ITEMS(t)];

  // Notify CSS about sidebar state (used by .main-logo)
  useEffect(() => {
    document.documentElement.dataset.sidebar = collapsed ? 'collapsed' : 'open';
    return () => { delete document.documentElement.dataset.sidebar; };
  }, [collapsed]);

  const PlanIcon = PLAN_ICON[user?.plan];

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          DESKTOP SIDEBAR
          ══════════════════════════════════════════════════════ */}
      <aside
        className={clsx(
          'hidden md:flex flex-col h-screen sticky top-0 z-30 shrink-0 overflow-hidden',
          'bg-dark-surface border-r border-dark-border',
          collapsed ? 'w-[64px]' : 'w-[240px]'
        )}
        style={{ transition: 'width 0.28s cubic-bezier(0.4,0,0.2,1)' }}
      >

        {/* ── Brand header ─────────────────────────────────── */}
        <div className={clsx(
          'flex items-center h-[56px] shrink-0 border-b border-dark-border overflow-hidden',
          collapsed ? 'px-0 justify-center' : 'px-4 gap-3'
        )}
          style={{ transition: 'padding 0.28s cubic-bezier(0.4,0,0.2,1)' }}
        >
          {/* Logo icon — always visible */}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500
                          flex items-center justify-center shrink-0
                          shadow-md shadow-primary-600/30 animate-pulse-glow">
            <BrainCircuit size={16} className="text-white" />
          </div>

          {/* Brand name — fades out when collapsed */}
          <div
            className="overflow-hidden whitespace-nowrap"
            style={{
              opacity:    collapsed ? 0 : 1,
              maxWidth:   collapsed ? '0px' : '160px',
              transition: 'opacity 0.18s ease, max-width 0.28s cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            <span className="font-black text-[15px] text-white tracking-tight">
              Mentora <span className="gradient-text">AI</span>
            </span>
          </div>
        </div>

        {/* ── Main nav ─────────────────────────────────────── */}
        <nav className="flex-1 flex flex-col gap-0.5 overflow-y-auto overflow-x-hidden py-3 px-2">
          {NAV_ITEMS(t).map(({ to, icon: Icon, label, badge }, i) => {
            const active = isActive(to);
            const item = (
              <Link
                key={to}
                to={to}
                className={clsx(
                  'sidebar-item group relative flex items-center rounded-xl text-sm font-medium',
                  'transition-all duration-150 overflow-hidden select-none',
                  collapsed ? 'h-10 w-10 mx-auto justify-center' : 'h-10 px-3 gap-3',
                  active
                    ? 'bg-primary-600/15 border border-primary-500/25 text-primary-300'
                    : 'border border-transparent text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                )}
                style={{ animationDelay: `${i * 35}ms` }}
              >
                {/* Active accent bar — left edge */}
                {active && !collapsed && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[55%]
                                   bg-gradient-to-b from-primary-400 to-violet-500 rounded-r-full" />
                )}

                {/* Icon */}
                <Icon
                  size={17}
                  className={clsx(
                    'shrink-0 transition-transform duration-150',
                    active ? 'text-primary-400' : 'text-slate-500 group-hover:text-slate-300 group-hover:scale-110'
                  )}
                />

                {/* Label — hidden when collapsed */}
                {!collapsed && (
                  <span className="flex-1 truncate font-semibold leading-none">{label}</span>
                )}

                {/* Badge — hidden when collapsed */}
                {badge && !collapsed && (
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md leading-none
                                   bg-gradient-to-r from-primary-600/50 to-violet-600/40 text-primary-300">
                    {badge}
                  </span>
                )}

                {/* Tiny active dot in collapsed mode */}
                {active && collapsed && (
                  <span className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-1 h-4
                                   bg-gradient-to-b from-primary-400 to-violet-500 rounded-l-full" />
                )}
              </Link>
            );

            return collapsed
              ? <Tooltip key={to} label={label}>{item}</Tooltip>
              : item;
          })}
        </nav>

        {/* ── Bottom section ────────────────────────────────── */}
        <div className="shrink-0 border-t border-dark-border py-3 px-2 flex flex-col gap-1">

          {/* Settings */}
          {BOTTOM_ITEMS(t).map(({ to, icon: Icon, label }) => {
            const active = isActive(to);
            const item = (
              <Link
                key={to}
                to={to}
                className={clsx(
                  'group relative flex items-center rounded-xl text-sm font-medium',
                  'transition-all duration-150 overflow-hidden select-none',
                  collapsed ? 'h-10 w-10 mx-auto justify-center' : 'h-10 px-3 gap-3',
                  active
                    ? 'bg-primary-600/15 border border-primary-500/25 text-primary-300'
                    : 'border border-transparent text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                )}
              >
                <Icon size={17} className={clsx(
                  'shrink-0 transition-transform duration-150',
                  active ? 'text-primary-400' : 'text-slate-500 group-hover:text-slate-300 group-hover:scale-110'
                )} />
                {!collapsed && (
                  <span className="flex-1 truncate font-semibold leading-none">{label}</span>
                )}
              </Link>
            );
            return collapsed ? <Tooltip key={to} label={label}>{item}</Tooltip> : item;
          })}

          {/* Theme + Language toggles — only when expanded */}
          <div
            className="overflow-hidden"
            style={{
              maxHeight:  collapsed ? '0px' : '44px',
              opacity:    collapsed ? 0 : 1,
              transition: 'max-height 0.25s ease, opacity 0.18s ease',
            }}
          >
            <div className="flex gap-2 px-1 pt-1">
              <ThemeToggle />
              <LanguageToggle />
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-dark-border mx-1" />

          {/* User card */}
          {collapsed ? (
            /* Collapsed: just avatar centered with tooltip */
            <Tooltip label={user?.fullname || 'Account'}>
              <button
                onClick={handleLogout}
                className="h-10 w-10 mx-auto flex items-center justify-center rounded-xl
                           hover:bg-red-500/10 transition-colors group"
                title="Sign out"
              >
                {user?.avatar?.url ? (
                  <img src={user.avatar.url} alt="avatar"
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-primary-500/20" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-accent-500
                                  flex items-center justify-center text-white text-[11px] font-black
                                  ring-2 ring-primary-500/20 group-hover:ring-red-500/30 transition-all">
                    {user?.fullname?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
              </button>
            </Tooltip>
          ) : (
            /* Expanded: full user card */
            <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl
                            bg-dark-card border border-dark-border
                            hover:border-primary-500/20 transition-colors">
              {/* Avatar */}
              {user?.avatar?.url ? (
                <img src={user.avatar.url} alt="avatar"
                  className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-primary-500/20" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500
                                flex items-center justify-center text-white text-xs font-black shrink-0
                                ring-2 ring-primary-500/20">
                  {user?.fullname?.[0]?.toUpperCase() || 'U'}
                </div>
              )}

              {/* Name + plan */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate leading-none mb-1">
                  {user?.fullname || 'User'}
                </p>
                <div className="flex items-center gap-1">
                  {PlanIcon && <PlanIcon size={9} className={PLAN_COLOR[user?.plan]} />}
                  <span className="text-[10px] text-slate-500 font-medium">
                    {PLAN_LABEL[user?.plan] || 'Free'}
                  </span>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                title="Sign out"
                className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg
                           text-slate-600 hover:text-red-400 hover:bg-red-500/10
                           active:scale-95 transition-all"
              >
                <LogOut size={13} />
              </button>
            </div>
          )}

          {/* Collapse / Expand toggle */}
          {collapsed ? (
            <Tooltip label="Expand sidebar">
              <button
                onClick={() => setCollapsed(false)}
                className="h-10 w-10 mx-auto flex items-center justify-center rounded-xl
                           text-slate-600 hover:text-slate-300 hover:bg-white/[0.04]
                           active:scale-95 transition-all"
              >
                <ChevronRight size={15} />
              </button>
            </Tooltip>
          ) : (
            <button
              onClick={() => setCollapsed(true)}
              className="flex items-center gap-2 h-9 px-2 rounded-xl w-full
                         text-slate-600 hover:text-slate-300 hover:bg-white/[0.04]
                         active:scale-95 transition-all text-xs font-medium"
            >
              <ChevronLeft size={14} />
              <span>Collapse</span>
            </button>
          )}
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════
          MOBILE BOTTOM NAV
          ══════════════════════════════════════════════════════ */}
      <nav className="mobile-nav-enter md:hidden fixed bottom-0 left-0 right-0 z-50
                      bg-dark-surface/95 backdrop-blur-xl border-t border-dark-border
                      flex items-stretch">
        {allMobile.map(({ to, icon: Icon, label }) => {
          const active = isActive(to);
          return (
            <Link
              key={to}
              to={to}
              className="relative flex-1 flex flex-col items-center justify-center gap-0.5
                         py-2 px-1 min-h-[56px] transition-colors duration-150"
              style={{ color: active ? '#a78bfa' : '#475569' }}
            >
              {/* Active pill bg */}
              <span
                className="absolute inset-x-1.5 inset-y-1 rounded-xl"
                style={{
                  background: active ? 'rgba(124,58,237,0.12)' : 'transparent',
                  transition: 'background 0.2s ease',
                }}
              />

              {/* Icon */}
              <Icon
                size={20}
                strokeWidth={active ? 2.5 : 1.8}
                className="relative z-10"
                style={{
                  transform:  active ? 'scale(1.15) translateY(-1px)' : 'scale(1)',
                  transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)',
                }}
              />

              {/* Label */}
              <span className="relative z-10 text-[10px] font-semibold leading-none">
                {label}
              </span>

              {/* Top pip indicator */}
              <span
                className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 rounded-b-full
                           bg-gradient-to-r from-primary-400 to-violet-400"
                style={{
                  width:      active ? '22px' : '0px',
                  opacity:    active ? 1 : 0,
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
