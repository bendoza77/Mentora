import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import {
  BrainCircuit, LayoutDashboard, MessageSquare, ClipboardCheck,
  BarChart3, BookOpen, Settings, LogOut, ChevronLeft, ChevronRight,
  Zap, Crown
} from 'lucide-react';
import Badge from '../ui/Badge';
import clsx from 'clsx';
import ThemeToggle from '../ui/ThemeToggle';
import LanguageToggle from '../ui/LanguageToggle';

const NAV_ITEMS = (t) => [
  { to: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard'), id: 'dashboard' },
  { to: '/tutor', icon: MessageSquare, label: t('nav.aiTutor'), id: 'tutor', badge: 'AI' },
  { to: '/exam', icon: ClipboardCheck, label: t('nav.examSim'), id: 'exam' },
  { to: '/analytics', icon: BarChart3, label: t('nav.analytics'), id: 'analytics' },
  { to: '/practice', icon: BookOpen, label: t('nav.practice'), id: 'practice' },
];

const BOTTOM_ITEMS = (t) => [
  { to: '/settings', icon: Settings, label: t('nav.settings'), id: 'settings' },
];

export default function Sidebar() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (to) => location.pathname === to;

  const planColors = {
    free: 'ghost',
    pro: 'primary',
    premium: 'warning',
  };

  return (
    <aside
      className={clsx(
        'sidebar-transition flex flex-col h-screen bg-dark-surface border-r border-dark-border sticky top-0 z-30',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className={clsx(
        'flex items-center gap-3 px-4 py-5 border-b border-dark-border',
        collapsed && 'justify-center'
      )}>
        <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-md shadow-primary-600/30 animate-pulse-glow">
          <BrainCircuit size={20} className="text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-white text-lg leading-none">
            Mentora <span className="gradient-text">AI</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {NAV_ITEMS(t).map(({ to, icon: Icon, label, badge }) => (
          <Link
            key={to}
            to={to}
            className={clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
              collapsed && 'justify-center px-2',
              isActive(to)
                ? 'bg-primary-600/20 text-primary-300 border border-primary-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            )}
          >
            <Icon size={18} className={clsx('shrink-0', isActive(to) ? 'text-primary-400' : 'text-slate-500 group-hover:text-slate-300')} />
            {!collapsed && <span className="flex-1">{label}</span>}
            {!collapsed && badge && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-primary-600/30 text-primary-300">
                {badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-dark-border px-3 py-4 flex flex-col gap-1">
        {BOTTOM_ITEMS(t).map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
              collapsed && 'justify-center',
              'text-slate-400 hover:text-white hover:bg-white/5'
            )}
          >
            <Icon size={18} className="text-slate-500 shrink-0" />
            {!collapsed && label}
          </Link>
        ))}

        {/* Controls */}
        {!collapsed && (
          <div className="flex gap-2 mt-2 px-3">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        )}

        {/* User Avatar */}
        <div className={clsx(
          'flex items-center gap-3 mt-3 px-3 py-2.5 rounded-xl bg-dark-card border border-dark-border',
          collapsed && 'justify-center'
        )}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user?.name?.[0] || 'G'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.fullname}</p>
              <div className="flex items-center gap-1 mt-0.5">
                {user?.plan === 'premium' ? <Crown size={10} className="text-amber-400" /> :
                 user?.plan === 'pro' ? <Zap size={10} className="text-primary-400" /> : null}
                <Badge variant={planColors[user?.plan] || 'ghost'} className="capitalize text-[10px] py-0">
                  {user?.plan}
                </Badge>
              </div>
            </div>
          )}
          {!collapsed && (
            <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition-colors">
              <LogOut size={15} />
            </button>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={clsx(
            'flex items-center justify-center w-full mt-2 py-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-all duration-150 text-xs gap-1'
          )}
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
