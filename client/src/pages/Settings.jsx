import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import usePageTitle from '../hooks/usePageTitle';
import {
  User, Palette, CreditCard, Shield, AlertTriangle,
  Check, ChevronRight, Camera, Zap, Crown,
  Moon, Sun, Globe, Lock, Mail, Smartphone, Trash2,
  Download, LogOut, Eye, EyeOff
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import clsx from 'clsx';

/* ─── Primitives ─── */
const Toggle = ({ checked, onChange, disabled }) => (
  <button
    onClick={onChange}
    disabled={disabled}
    className={clsx(
      'relative shrink-0 rounded-full transition-all duration-300 active:scale-95',
      'w-12 h-6',
      checked ? 'bg-primary-600 shadow-md shadow-primary-600/40' : 'bg-dark-surface border border-dark-border',
      disabled && 'opacity-40 cursor-not-allowed'
    )}
  >
    <span
      className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300"
      style={{ transform: checked ? 'translateX(1.75rem)' : 'translateX(0.25rem)' }}
    />
  </button>
);


const SettingRow = ({ label, desc, children, danger }) => (
  <div className={clsx(
    'flex items-center justify-between gap-6 py-4 border-b border-dark-border last:border-0',
    danger && 'opacity-90'
  )}>
    <div className="min-w-0">
      <p className={clsx('text-sm font-medium', danger ? 'text-red-400' : 'text-white')}>{label}</p>
      {desc && <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{desc}</p>}
    </div>
    <div className="shrink-0">{children}</div>
  </div>
);


const SectionCard = ({ children, className = '' }) => (
  <div className={clsx('bg-dark-card border border-dark-border rounded-2xl overflow-hidden', className)}>
    {children}
  </div>
);

const SectionHeader = ({ icon: Icon, title, badge }) => (
  <div className="flex items-center gap-3 px-6 py-4 border-b border-dark-border bg-dark-surface/50">
    <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
      <Icon size={16} className="text-primary-400" />
    </div>
    <h2 className="text-sm font-bold text-white">{title}</h2>
    {badge && <span className="ml-auto">{badge}</span>}
  </div>
);

const InputField = ({ label, type = 'text', name, value, onChange, placeholder, icon: Icon }) => {
  const [showPass, setShowPass] = useState(false);
  const isPass = type === 'password';
  return (
    <div>
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">{label}</label>
      <div className="relative">
        {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />}
        <input
          type={isPass && showPass ? 'text' : type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={clsx(
            'w-full bg-dark-surface border border-dark-border rounded-xl py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary-500/60 transition-colors',
            Icon ? 'pl-10 pr-4' : 'px-4',
            isPass && 'pr-10'
          )}
        />
        {isPass && (
          <button
            type="button"
            onClick={() => setShowPass(s => !s)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
          >
            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  );
};

/* ─── NAV ITEMS ─── */
const NAV_ITEMS = [
  { id: 'profile',      icon: User,         label: 'Profile' },
  { id: 'appearance',   icon: Palette,      label: 'Appearance' },
  { id: 'subscription', icon: CreditCard,   label: 'Subscription' },
  { id: 'security',     icon: Shield,       label: 'Security' },
  { id: 'danger',       icon: AlertTriangle,label: 'Danger Zone', danger: true },
];

const PLANS = {
  free:    { label: 'Free',    color: 'ghost',   icon: null },
  pro:     { label: 'Pro',     color: 'primary', icon: Zap },
  premium: { label: 'Premium', color: 'warning', icon: Crown },
};

/* ─── SECTIONS ─── */

function ProfileSection() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.fullname || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [status, setStatus] = useState(null); // null | 'saving' | 'success' | error string
  const fileInputRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setStatus('saving');
    try {
      const formData = new FormData();
      formData.append('fullname', name);
      if (avatarFile) formData.append('avatar', avatarFile);
      await updateProfile(user._id, formData);
      setAvatarFile(null);
      setStatus('success');
      setTimeout(() => setStatus(null), 2500);
    } catch (err) {
      setStatus(err.message || 'Update failed');
    }
  };

  const displayAvatar = avatarPreview || user?.avatar?.url;
  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently';

  return (
    <div className="space-y-6">
      <SectionCard>
        <SectionHeader icon={User} title="Profile Information" />
        <div className="p-6 space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-5">
            <div
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt="avatar"
                  className="w-20 h-20 rounded-2xl object-cover shadow-lg shadow-primary-600/25"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-primary-600/25">
                  {name?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera size={18} className="text-white" />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <div>
              <p className="text-sm font-semibold text-white mb-0.5">{name || 'Your Name'}</p>
              <p className="text-xs text-slate-500 mb-2">{user?.email}</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
              >
                {avatarFile ? 'Photo selected ✓' : 'Change photo'}
              </button>
            </div>
          </div>

          <div className="h-px bg-dark-border" />

          <div className="grid sm:grid-cols-2 gap-4">
            <InputField
              label="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your full name"
              icon={User}
            />
            <InputField
              label="Email Address"
              type="email"
              value={user?.email || ''}
              placeholder="your@email.com"
              icon={Mail}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-slate-600">Joined {joinedDate}</p>
            <div className="flex items-center gap-3">
              {status === 'success' && <p className="text-xs text-emerald-400">Saved!</p>}
              {status && status !== 'success' && status !== 'saving' && (
                <p className="text-xs text-red-400">{status}</p>
              )}
              <Button
                variant="gradient"
                size="sm"
                onClick={handleSave}
                disabled={status === 'saving'}
                icon={status === 'success' ? <Check size={14} /> : null}
              >
                {status === 'saving' ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Connected accounts — only shown for Google users */}
      {user?.provider === 'google' && (
        <SectionCard>
          <SectionHeader icon={Globe} title="Connected Accounts" />
          <div className="p-6">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-dark-border flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Google</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
              </div>
              <Badge variant="success" dot>Connected</Badge>
            </div>
          </div>
        </SectionCard>
      )}
    </div>
  );
}

function AppearanceSection() {
  const { isDark, toggle } = useTheme();
  const { i18n } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Theme */}
      <SectionCard>
        <SectionHeader icon={Palette} title="Theme" />
        <div className="p-6">
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { id: 'dark', icon: Moon, label: 'Dark', desc: 'Easier on the eyes during night study sessions' },
              { id: 'light', icon: Sun, label: 'Light', desc: 'Clean and bright for daytime learning' },
            ].map(({ id, icon: Icon, label, desc }) => (
              <button
                key={id}
                onClick={() => { if ((id === 'dark') !== isDark) toggle(); }}
                className={clsx(
                  'flex flex-col items-start gap-2 p-4 rounded-xl border text-left transition-all',
                  (id === 'dark') === isDark
                    ? 'bg-primary-600/15 border-primary-500/40 ring-1 ring-primary-500/30'
                    : 'bg-dark-surface border-dark-border hover:border-dark-muted'
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <Icon size={18} className={(id === 'dark') === isDark ? 'text-primary-400' : 'text-slate-500'} />
                  {(id === 'dark') === isDark && (
                    <div className="w-4 h-4 rounded-full bg-primary-600 flex items-center justify-center">
                      <Check size={10} className="text-white" />
                    </div>
                  )}
                </div>
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </button>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Language */}
      <SectionCard>
        <SectionHeader icon={Globe} title="Language & Region" />
        <div className="p-6">
          <p className="text-xs text-slate-500 mb-3">Interface language</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { lang: 'ka', flag: '🇬🇪', label: 'ქართული', sub: 'Georgian' },
              { lang: 'en', flag: '🇺🇸', label: 'English', sub: 'English' },
            ].map(({ lang, flag, label, sub }) => (
              <button
                key={lang}
                onClick={() => { i18n.changeLanguage(lang); localStorage.setItem('mentora_lang', lang); }}
                className={clsx(
                  'flex items-center gap-3 p-4 rounded-xl border text-left transition-all',
                  i18n.language === lang
                    ? 'bg-primary-600/15 border-primary-500/40 ring-1 ring-primary-500/30'
                    : 'bg-dark-surface border-dark-border hover:border-dark-muted'
                )}
              >
                <span className="text-2xl">{flag}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-xs text-slate-500">{sub}</p>
                </div>
                {i18n.language === lang && (
                  <div className="ml-auto w-4 h-4 rounded-full bg-primary-600 flex items-center justify-center">
                    <Check size={10} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}


function SubscriptionSection({ user }) {
  const [annual, setAnnual] = useState(false);
  const plan = PLANS[user?.plan] || PLANS.free;
  const PlanIcon = plan.icon;

  const PLAN_FEATURES = {
    free:    ['5 problems/day', 'Basic hints', 'Limited analytics'],
    pro:     ['Unlimited problems', 'Full AI explanations', 'Progress analytics', 'Weakness detection', '3 exams/month'],
    premium: ['Everything in Pro', 'Unlimited exams', 'Predictive AI', 'Parent reports', 'Score guarantee'],
  };

  return (
    <div className="space-y-6">
      {/* Current plan */}
      <SectionCard>
        <SectionHeader
          icon={CreditCard}
          title="Current Plan"
          badge={<Badge variant={plan.color}>{plan.label}</Badge>}
        />
        <div className="p-6">
          <div className="flex items-start justify-between gap-6 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {PlanIcon && <PlanIcon size={18} className="text-primary-400" />}
                <h3 className="text-2xl font-extrabold text-white capitalize">{user?.plan} Plan</h3>
              </div>
              {user?.plan !== 'free' && (
                <p className="text-sm text-slate-400">Next billing: March 1, 2026 · <span className="text-white font-medium">15 GEL/month</span></p>
              )}
            </div>
            {user?.plan !== 'premium' && (
              <Link to={"/pricing"}>
                <Button variant="gradient" size="sm">
                  {user?.plan === 'free' ? 'Upgrade to Pro' : 'Go Premium'}
                </Button>
              </Link>
            )}
          </div>

          {/* Plan features */}
          <div className="bg-dark-surface rounded-xl p-4 border border-dark-border">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Your plan includes</p>
            <ul className="space-y-2">
              {(PLAN_FEATURES[user?.plan] || PLAN_FEATURES.free).map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                  <Check size={13} className="text-emerald-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SectionCard>

      {/* Billing Period Toggle */}
      <SectionCard>
        <SectionHeader icon={CreditCard} title="Billing Period" />
        <div className="p-6">
          <div className="flex items-center gap-4">
            <span className={`text-sm font-medium transition-colors ${!annual ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
            <button
              onClick={() => setAnnual(a => !a)}
              className={`relative w-12 h-6 rounded-full transition-all duration-300 active:scale-95 ${annual ? 'bg-primary-600 shadow-md shadow-primary-600/40' : 'bg-dark-surface border border-dark-border'}`}
            >
              <span
                className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300"
                style={{ transform: annual ? 'translateX(1.75rem)' : 'translateX(0.25rem)' }}
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${annual ? 'text-white' : 'text-slate-500'}`}>Annual</span>
            {annual && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Save up to 32%
              </span>
            )}
          </div>
          {user?.plan === 'free' && (
            <div className="mt-5 flex gap-3">
              <Link to={`/purchase?plan=pro&billing=${annual ? 'annual' : 'monthly'}`} className="flex-1">
                <Button variant="gradient" size="sm" className="w-full">
                  Get Pro · {annual ? '₾13' : '₾19'}/mo
                </Button>
              </Link>
              <Link to={`/purchase?plan=premium&billing=${annual ? 'annual' : 'monthly'}`} className="flex-1">
                <Button variant="secondary" size="sm" className="w-full">
                  Get Premium · {annual ? '₾24' : '₾35'}/mo
                </Button>
              </Link>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Billing */}
      {user?.plan !== 'free' && (
        <SectionCard>
          <SectionHeader icon={CreditCard} title="Billing" />
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-dark-border">
              <div>
                <p className="text-sm font-medium text-white">Payment Method</p>
                <p className="text-xs text-slate-500 mt-0.5">Visa ending in 4242</p>
              </div>
              <button className="text-xs text-primary-400 hover:text-primary-300 transition-colors">Update</button>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">Cancel subscription</p>
              <button className="text-xs text-red-400 hover:text-red-300 transition-colors">Cancel Plan</button>
            </div>
          </div>
        </SectionCard>
      )}
    </div>
  );
}

function SecuritySection() {
  const [twoFA, setTwoFA] = useState(false);
  const [sessions] = useState([
    { device: 'Chrome · Windows 11', location: 'Tbilisi, GE', current: true, time: 'Now' },
    { device: 'Mobile · Android 14', location: 'Tbilisi, GE', current: false, time: '2h ago' },
  ]);
  const { changePassword, user } = useAuth();
  const [pwStatus, setPwStatus] = useState(null);
  const isOAuth = user?.provider === 'google';

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwStatus(null);
    try {
      await changePassword(user._id, {
        ...(!isOAuth && { currentPassword: e.target.curPassword.value }),
        newPassword: e.target.newPassword.value,
        confrimPassword: e.target.conPassword.value
      });
      setPwStatus('success');
      e.target.reset();
    } catch (err) {
      setPwStatus(err.message || 'error');
    }
  }

  return (
    <div className="space-y-6">
      <SectionCard>
        <SectionHeader icon={Lock} title={isOAuth ? 'Set Password' : 'Password'} />
        <div className="p-6 space-y-4">
          {isOAuth && (
            <div className="p-3 rounded-xl bg-primary-500/10 border border-primary-500/20">
              <p className="text-xs text-primary-400">You signed in with Google. Set a password to also log in with your email.</p>
            </div>
          )}
          <form onSubmit={handleChangePassword}>
            {!isOAuth && (
              <><InputField label="Current Password" name="curPassword" type="password" placeholder="Enter current password" icon={Lock} /><br /></>
            )}
            <InputField label="New Password" name="newPassword" type="password" placeholder="Min 8 characters" icon={Lock} /> <br />
            <InputField label="Confirm New Password" name="conPassword" type="password" placeholder="Repeat new password" icon={Lock} /> <br />
            <Button variant="secondary" size="sm">{isOAuth ? 'Set Password' : 'Update Password'}</Button>
            {pwStatus === 'success' && (
              <p className="mt-3 text-xs text-emerald-400">Password {isOAuth ? 'set' : 'updated'} successfully.</p>
            )}
            {pwStatus && pwStatus !== 'success' && (
              <p className="mt-3 text-xs text-red-400">{pwStatus}</p>
            )}
          </form>
        </div>
      </SectionCard>

      <SectionCard>
        <SectionHeader icon={Smartphone} title="Two-Factor Authentication" />
        <div className="p-6">
          <SettingRow
            label="Enable 2FA"
            desc="Adds an extra layer of security using your phone. Highly recommended."
          >
            <Toggle checked={twoFA} onChange={() => setTwoFA(v => !v)} />
          </SettingRow>
          {twoFA && (
            <div className="mt-4 p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/15">
              <p className="text-xs text-emerald-400">2FA enabled via authenticator app. Your account is now more secure.</p>
            </div>
          )}
        </div>
      </SectionCard>

      <SectionCard>
        <SectionHeader icon={Shield} title="Active Sessions" />
        <div className="p-6 space-y-3">
          {sessions.map(({ device, location, current, time }) => (
            <div key={device} className="flex items-center justify-between py-3 border-b border-dark-border last:border-0">
              <div className="flex items-center gap-3">
                <div className={clsx(
                  'w-2 h-2 rounded-full',
                  current ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
                )} />
                <div>
                  <p className="text-sm font-medium text-white">{device}</p>
                  <p className="text-xs text-slate-500">{location} · {time}</p>
                </div>
              </div>
              {current ? (
                <Badge variant="success" dot>Current</Badge>
              ) : (
                <button className="text-xs text-red-400 hover:text-red-300 transition-colors">Revoke</button>
              )}
            </div>
          ))}
          <button className="text-xs text-red-400 hover:text-red-300 transition-colors mt-2">
            Revoke all other sessions
          </button>
        </div>
      </SectionCard>
    </div>
  );
}

function DangerSection({ logout, navigate }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [typed, setTyped] = useState('');
  const { handleDelete, user } = useAuth();

  const deleteUser = async () => {
    await handleDelete(user._id);
    navigate("/register");
  }


  return (
    <div className="space-y-6">
      <SectionCard>
        <SectionHeader icon={Download} title="Data Export" />
        <div className="p-6">
          <SettingRow
            label="Export Your Data"
            desc="Download everything — your profile, attempt history, chat logs, and analytics as a JSON file."
          >
            <Button variant="secondary" size="sm" icon={<Download size={14} />}>Export</Button>
          </SettingRow>
        </div>
      </SectionCard>

      <SectionCard>
        <SectionHeader icon={LogOut} title="Sign Out" />
        <div className="p-6">
          <SettingRow
            label="Sign out of Mentora AI"
            desc="You'll need to sign back in with Google to access your account."
          >
            <Button variant="ghost" size="sm" icon={<LogOut size={14} />} onClick={() => { logout(); navigate('/login'); }}>
              Sign Out
            </Button>
          </SettingRow>
        </div>
      </SectionCard>

      <SectionCard className="border-red-500/25">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-red-500/15 bg-red-500/5">
          <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center">
            <AlertTriangle size={15} className="text-red-400" />
          </div>
          <h2 className="text-sm font-bold text-red-400">Danger Zone</h2>
        </div>
        <div className="p-6">
          <SettingRow
            label="Delete Account"
            desc="Permanently delete your account and all associated data. This action cannot be undone."
            danger
          >
            <Button
              variant="danger"
              size="sm"
              onClick={() => setConfirmDelete(true)}
              icon={<Trash2 size={14} />}
            >
              Delete
            </Button>
          </SettingRow>

          {confirmDelete && (
            <div className="mt-5 p-5 rounded-xl bg-red-500/8 border border-red-500/20 space-y-4">
              <p className="text-sm text-red-300 font-medium">Are you absolutely sure?</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                This will permanently delete your account, all problem attempts, chat history, and subscription data. You will lose your streak, progress, and any remaining subscription time. This cannot be undone.
              </p>
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Type <strong className="text-red-400 font-mono">DELETE</strong> to confirm</label>
                <input
                  type="text"
                  value={typed}
                  onChange={e => setTyped(e.target.value)}
                  placeholder="DELETE"
                  className="w-full bg-dark-surface border border-red-500/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-700 focus:outline-none focus:border-red-500/60 font-mono"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="danger"
                  size="sm"
                  disabled={typed !== 'DELETE'}
                  icon={<Trash2 size={13} />}
                  onClick={deleteUser}
                >
                  Delete My Account
                </Button>
                <Button variant="ghost" size="sm" onClick={() => { setConfirmDelete(false); setTyped(''); }}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}

/* ─── MAIN SETTINGS PAGE ─── */
export default function Settings() {
  usePageTitle('Settings');
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState('profile');

  const renderSection = () => {
    switch (active) {
      case 'profile':       return <ProfileSection />;
      case 'appearance':    return <AppearanceSection />;
      case 'subscription':  return <SubscriptionSection user={user} />;
      case 'security':      return <SecuritySection />;
      case 'danger':        return <DangerSection logout={logout} navigate={navigate} />;
      default:              return null;
    }
  };

  const activeItem = NAV_ITEMS.find(i => i.id === active);

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Settings Sidebar */}
      <aside className="w-56 shrink-0 border-r border-dark-border bg-dark-surface/60 flex flex-col py-5 px-3 overflow-y-auto">
        <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest px-3 mb-3">
          {t('nav.settings')}
        </p>
        <nav className="flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ id, icon: Icon, label, danger }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left',
                active === id
                  ? danger
                    ? 'bg-red-500/15 text-red-400 border border-red-500/25'
                    : 'bg-primary-600/15 text-primary-300 border border-primary-500/25'
                  : danger
                    ? 'text-red-400/70 hover:text-red-400 hover:bg-red-500/8'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon size={16} className="shrink-0" />
              {label}
              {active === id && <ChevronRight size={13} className="ml-auto opacity-50" />}
            </button>
          ))}
        </nav>

        {/* User mini card at bottom */}
        <div className="mt-auto pt-4 border-t border-dark-border mx-1">
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user?.name?.[0] || 'G'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <Badge variant={PLANS[user?.plan]?.color || 'ghost'} className="text-[10px] py-0 mt-0.5">
                {PLANS[user?.plan]?.label || 'Free'}
              </Badge>
            </div>
          </div>
        </div>
      </aside>

      {/* Content area */}
      <main className="flex-1 overflow-y-auto p-6 space-y-1">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-600 mb-6">
          <span>Settings</span>
          <ChevronRight size={12} />
          <span className="text-slate-300">{activeItem?.label}</span>
        </div>
        {renderSection()}
      </main>
    </div>
  );
}
