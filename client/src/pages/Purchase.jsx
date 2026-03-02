import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';
import {
  BrainCircuit, Shield, Lock, Check, ArrowRight,
  ChevronDown, Zap, Crown, Star, Sparkles, CheckCircle2,
  Tag, X, AlertCircle, LayoutDashboard, Clock, Users,
  TrendingUp, Flame, BookOpen, Loader2, ExternalLink,
} from 'lucide-react';
import clsx from 'clsx';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

/* ── Plans ── */
const PLANS = {
  free: {
    key: 'free', icon: Star, name: 'Free', monthlyPrice: 0, annualPrice: 0,
    iconColor: 'text-slate-400', iconBg: 'bg-slate-500/10',
    accentGradient: 'from-slate-500 to-slate-400',
    features: ['50 AI Tutor questions / month', '200 practice problems', 'Basic analytics', '1 mini mock exam / month'],
  },
  pro: {
    key: 'pro', icon: Zap, name: 'Pro', monthlyPrice: 19, annualPrice: 13,
    iconColor: 'text-primary-400', iconBg: 'bg-primary-500/10',
    accentGradient: 'from-primary-600 to-accent-500',
    popular: true,
    features: ['Unlimited AI Tutor questions', 'Unlimited practice problems', 'Full analytics & heatmap', 'Unlimited mock exams', 'Adaptive difficulty engine', 'Score prediction model', 'Priority AI response speed'],
  },
  premium: {
    key: 'premium', icon: Crown, name: 'Premium', monthlyPrice: 35, annualPrice: 24,
    iconColor: 'text-amber-400', iconBg: 'bg-amber-500/10',
    accentGradient: 'from-amber-500 to-yellow-400',
    bestValue: true,
    features: ['Everything in Pro', 'Personal study roadmap AI', 'ENT topic mastery certification', 'Score guarantee program', 'Parent/teacher progress reports', 'Dedicated support chat', 'Exclusive student community'],
  },
};

const VALID_COUPONS = {
  MENTORA20: { label: '20% off', discount: 0.20 },
  STUDENT10: { label: '10% off', discount: 0.10 },
  ENT2025:   { label: '15% off', discount: 0.15 },
};

/* ── Plan Selector ── */
function PlanSelector({ selected, setSelected, annual }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {Object.values(PLANS).filter(p => p.key !== 'free').map((plan) => {
        const Icon = plan.icon;
        const price = annual ? plan.annualPrice : plan.monthlyPrice;
        const isSelected = selected === plan.key;
        return (
          <button
            key={plan.key}
            onClick={() => setSelected(plan.key)}
            className={clsx(
              'relative rounded-xl border p-3 text-left transition-all duration-200',
              isSelected
                ? plan.key === 'premium'
                  ? 'border-amber-500/60 bg-amber-500/8 ring-1 ring-amber-500/20'
                  : 'border-primary-500/60 bg-primary-500/8 ring-1 ring-primary-500/20'
                : 'border-[#1A1A3E] bg-[#0D0D1F] hover:border-[#2a2a5e]'
            )}
          >
            {plan.popular && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-primary-600 to-accent-500 text-white whitespace-nowrap">Popular</span>
              </div>
            )}
            {plan.bestValue && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black whitespace-nowrap">Best Value</span>
              </div>
            )}
            <div className={clsx('w-7 h-7 rounded-lg flex items-center justify-center mb-2', plan.iconBg)}>
              <Icon size={15} className={plan.iconColor} />
            </div>
            <p className="text-xs font-bold text-white mb-0.5">{plan.name}</p>
            <p className={clsx('text-lg font-black tabular-nums', plan.key === 'premium' ? 'text-amber-400' : 'text-white')}>
              ₾{price}<span className="text-xs font-normal text-slate-500">/mo</span>
            </p>
          </button>
        );
      })}
    </div>
  );
}

/* ── Order Summary ── */
function OrderSummary({ plan, annual, coupon }) {
  const price = annual ? plan.annualPrice : plan.monthlyPrice;
  const Icon = plan.icon;
  const discount = coupon ? price * coupon.discount : 0;
  const total = price - discount;
  const annualSavingsPct = plan.key === 'pro' ? 32 : 31;

  return (
    <div className="space-y-5">
      {/* Plan header */}
      <div className={clsx(
        'rounded-2xl border p-5 relative overflow-hidden',
        plan.key === 'premium' ? 'border-amber-500/30 bg-amber-500/5' : 'border-primary-500/30 bg-primary-500/5'
      )}>
        <div className={clsx('absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r', plan.accentGradient)} />
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', plan.iconBg)}>
              <Icon size={20} className={plan.iconColor} />
            </div>
            <div>
              <p className="font-bold text-white text-sm">{plan.name} Plan</p>
              <p className="text-xs text-slate-500">{annual ? 'Billed annually' : 'Billed monthly'}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={clsx('text-2xl font-black tabular-nums', plan.key === 'premium' ? 'text-amber-400' : 'text-white')}>
              ₾{price}
            </p>
            <p className="text-xs text-slate-500">/ month</p>
          </div>
        </div>
        {annual && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
            <Check size={12} strokeWidth={2.5} />
            Annual billing — you save <strong>{annualSavingsPct}%</strong> vs monthly
          </div>
        )}
      </div>

      {/* Features */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">What's included</p>
        <ul className="space-y-2.5">
          {plan.features.map(f => (
            <li key={f} className="flex items-start gap-2.5">
              <div className={clsx(
                'w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                plan.key === 'premium' ? 'bg-amber-500/15' : 'bg-primary-500/20'
              )}>
                <Check size={9} strokeWidth={3} className={plan.key === 'premium' ? 'text-amber-400' : 'text-primary-400'} />
              </div>
              <span className="text-sm text-slate-400 leading-snug">{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Price breakdown */}
      <div className="rounded-xl border border-[#1A1A3E] bg-[#0D0D1F] p-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">{plan.name} ({annual ? 'Annual' : 'Monthly'})</span>
          <span className="text-white font-medium">₾{price}/mo</span>
        </div>
        {annual && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Annual total</span>
            <span className="text-white font-medium">₾{price * 12}/yr</span>
          </div>
        )}
        {coupon && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-emerald-400 flex items-center gap-1"><Tag size={12} />{coupon.label} coupon</span>
            <span className="text-emerald-400 font-medium">−₾{discount.toFixed(2)}</span>
          </div>
        )}
        <div className="h-px bg-[#1A1A3E]" />
        <div className="flex items-center justify-between">
          <span className="text-white font-bold">Total due today</span>
          <span className={clsx('text-xl font-black tabular-nums', plan.key === 'premium' ? 'text-amber-400' : 'text-primary-400')}>
            ₾{(annual ? total * 12 : total).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: Shield, label: '256-bit SSL', sub: 'Encrypted' },
          { icon: Lock,   label: 'TBC Secure', sub: 'via TBC Bank' },
          { icon: Clock,  label: 'Cancel',      sub: 'Anytime'    },
        ].map(({ icon: BIcon, label, sub }) => (
          <div key={label} className="rounded-xl border border-[#1A1A3E] bg-[#0D0D1F] p-3 text-center">
            <BIcon size={15} className="text-emerald-400 mx-auto mb-1" />
            <p className="text-[11px] font-semibold text-white">{label}</p>
            <p className="text-[10px] text-slate-600">{sub}</p>
          </div>
        ))}
      </div>

      {plan.key === 'premium' && (
        <div className="flex items-start gap-3 rounded-xl bg-amber-500/5 border border-amber-500/20 p-3">
          <Shield size={16} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-amber-400 mb-0.5">Score Guarantee</p>
            <p className="text-xs text-slate-500 leading-relaxed">If your ENT score doesn't improve, we'll refund your last month. No questions asked.</p>
          </div>
        </div>
      )}

      {/* Social proof */}
      <div className="flex items-center gap-3 px-1">
        <div className="flex -space-x-2 shrink-0">
          {['NK', 'AM', 'GT', 'SD'].map((init, i) => (
            <div key={init} className="w-7 h-7 rounded-full border-2 border-[#070712] flex items-center justify-center text-white text-[9px] font-bold"
              style={{ background: `hsl(${260 + i * 25}, 70%, 55%)` }}>
              {init}
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500">
          <span className="text-white font-semibold">12,400+ students</span> already improving with Mentora AI
        </p>
      </div>
    </div>
  );
}

/* ── Success Screen ── */
function SuccessScreen({ plan }) {
  const navigate = useNavigate();
  const Icon = plan.icon;
  return (
    <div className="text-center space-y-7 animate-fade-in-up">
      <div className="relative w-24 h-24 mx-auto">
        <div className="absolute inset-0 rounded-full bg-emerald-500/15 animate-ping-slow" />
        <div className="relative w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
          <CheckCircle2 size={42} className="text-emerald-400" strokeWidth={1.5} />
        </div>
      </div>

      <div>
        <div className={clsx(
          'inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4',
          plan.key === 'premium'
            ? 'bg-amber-500/10 border border-amber-500/20'
            : 'bg-primary-500/10 border border-primary-500/20'
        )}>
          <Icon size={14} className={plan.iconColor} />
          <span className={clsx('text-xs font-bold', plan.key === 'premium' ? 'text-amber-400' : 'text-primary-400')}>
            {plan.name} Plan Activated
          </span>
        </div>
        <h2 className="text-3xl font-extrabold text-white mb-2">Payment Successful!</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          Your <span className="text-white font-semibold">{plan.name}</span> plan is now active.<br />
          A receipt has been sent to your email.
        </p>
      </div>

      <div className="rounded-2xl border border-[#1A1A3E] bg-[#0D0D1F] p-5 text-left space-y-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Now unlocked for you</p>
        {[
          { icon: Flame,      color: 'text-amber-400',   text: 'Start your personalized study plan' },
          { icon: BookOpen,   color: 'text-primary-400', text: 'Unlimited practice problems ready' },
          { icon: TrendingUp, color: 'text-emerald-400', text: 'Advanced analytics dashboard activated' },
          { icon: Users,      color: 'text-cyan-400',    text: 'Exclusive student community access' },
        ].slice(0, plan.key === 'premium' ? 4 : 3).map(({ icon: BIcon, color, text }) => (
          <div key={text} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#070712] border border-[#1A1A3E] flex items-center justify-center shrink-0">
              <BIcon size={15} className={color} />
            </div>
            <span className="text-sm text-slate-300">{text}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('/dashboard')}
        className={clsx(
          'w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-bold text-base transition-all shadow-xl active:scale-[0.98]',
          plan.key === 'premium'
            ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-amber-500/25 hover:from-amber-400 hover:to-yellow-300'
            : 'bg-gradient-to-r from-primary-600 to-accent-500 text-white shadow-primary-600/30 hover:opacity-90'
        )}
      >
        <LayoutDashboard size={18} />
        Go to Dashboard
        <ArrowRight size={18} />
      </button>

      <p className="text-xs text-slate-600">
        Need help?{' '}
        <Link to="/contact" className="text-primary-400 hover:text-primary-300 transition-colors">
          Contact support
        </Link>
      </p>
    </div>
  );
}

/* ── Failed Screen ── */
function FailedScreen({ onRetry }) {
  return (
    <div className="text-center space-y-6 animate-fade-in-up">
      <div className="relative w-24 h-24 mx-auto">
        <div className="relative w-24 h-24 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
          <AlertCircle size={42} className="text-red-400" strokeWidth={1.5} />
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-extrabold text-white mb-2">Payment Unsuccessful</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          Your payment was not completed. No charge was made.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <button
          onClick={onRetry}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-bold text-base bg-gradient-to-r from-primary-600 to-accent-500 text-white shadow-xl shadow-primary-600/30 hover:opacity-90 transition-all active:scale-[0.98]"
        >
          Try Again
        </button>
        <Link to="/contact" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
          Contact support →
        </Link>
      </div>
    </div>
  );
}

/* ── TBC Checkout Form ── */
function TbcCheckoutForm({ plan, annual, onSuccess, onFail }) {
  const [couponInput,   setCouponInput]   = useState('');
  const [coupon,        setCoupon]        = useState(null);
  const [couponError,   setCouponError]   = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState('');

  const price    = annual ? plan.annualPrice : plan.monthlyPrice;
  const discount = coupon ? price * coupon.discount : 0;
  const total    = annual ? (price - discount) * 12 : price - discount;

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    const found = VALID_COUPONS[code];
    if (found) {
      setCoupon({ ...found, code });
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Invalid or expired coupon code.');
      setCoupon(null);
      setCouponApplied(false);
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponApplied(false);
    setCouponInput('');
    setCouponError('');
  };

  /**
   * Payment flow:
   * 1. POST /api/payments/tbc/create → get paymentUrl + merchantPaymentId
   * 2. Redirect user to TBC's hosted payment page
   * 3. TBC redirects user back to /purchase?provider=tbc&mpid=...
   * 4. We verify with GET /api/payments/tbc/verify/:mpid
   *
   * WHY redirect instead of embedding?
   *   TBC Bank's PCI-DSS compliant hosted page handles card data.
   *   Our servers never see the card number — reducing our security scope significantly.
   */
  const handlePay = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${SERVER_URL}/api/payments/tbc/create`, {
        method:      'POST',
        headers:     { 'Content-Type': 'application/json' },
        credentials: 'include', // send auth cookie
        body: JSON.stringify({
          plan:    plan.key,
          billing: annual ? 'annual' : 'monthly',
          coupon:  coupon?.code || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Payment initialization failed');
      }

      // Store merchantPaymentId in sessionStorage so we can verify on return
      // (the return URL also contains it, but sessionStorage is a backup)
      if (data.data?.merchantPaymentId) {
        sessionStorage.setItem('tbc_mpid', data.data.merchantPaymentId);
        sessionStorage.setItem('tbc_plan', plan.key);
      }

      // Redirect user to TBC's hosted payment page
      // From here, TBC handles card collection — our job is done until webhook fires
      window.location.href = data.data.paymentUrl;

    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">

      {/* TBC Bank notice */}
      <div className="flex items-start gap-3 rounded-xl bg-[#0B0B20] border border-[#1A1A3E] px-4 py-3">
        <div className="w-8 h-8 rounded-lg bg-[#FF6600]/10 border border-[#FF6600]/20 flex items-center justify-center shrink-0">
          {/* TBC orange color */}
          <span className="text-[#FF6600] font-black text-xs">TBC</span>
        </div>
        <div>
          <p className="text-xs font-semibold text-white mb-0.5">Secure Payment via TBC Bank</p>
          <p className="text-xs text-slate-500 leading-relaxed">
            You'll be redirected to TBC Bank's secure payment page.
            Your card details are handled entirely by TBC — we never see them.
          </p>
        </div>
      </div>

      {/* Promo code */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Promo Code</label>
        {couponApplied && coupon ? (
          <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-emerald-500/30 bg-emerald-500/8">
            <div className="flex items-center gap-2">
              <Tag size={14} className="text-emerald-400" />
              <span className="text-sm text-emerald-400 font-semibold">{coupon.code}</span>
              <span className="text-xs text-slate-500">— {coupon.label}</span>
            </div>
            <button type="button" onClick={removeCoupon} className="text-slate-500 hover:text-red-400 transition-colors">
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={couponInput}
              onChange={e => { setCouponInput(e.target.value); setCouponError(''); }}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), applyCoupon())}
              placeholder="e.g. MENTORA20"
              className="flex-1 bg-[#0a0a1a] border border-[#1A1A3E] rounded-xl py-3 px-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary-500/60 focus:ring-1 focus:ring-primary-500/20 transition-all"
            />
            <button
              type="button"
              onClick={applyCoupon}
              className="px-4 rounded-xl border border-primary-500/30 text-primary-400 text-sm font-semibold hover:bg-primary-500/10 transition-colors shrink-0"
            >
              Apply
            </button>
          </div>
        )}
        {couponError && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <AlertCircle size={11} />{couponError}
          </p>
        )}
      </div>

      <div className="h-px bg-[#1A1A3E]" />

      {/* Total line */}
      <div className="rounded-xl border border-[#1A1A3E] bg-[#0D0D1F] px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 mb-0.5">Total charged today</p>
          <p className="text-2xl font-black text-white tabular-nums">
            ₾{total.toFixed(2)}
            <span className="text-sm font-normal text-slate-500 ml-1">{annual ? '/year' : '/month'}</span>
          </p>
        </div>
        {coupon && (
          <div className="text-right">
            <p className="text-xs text-slate-600 line-through">₾{annual ? (price * 12).toFixed(2) : price.toFixed(2)}</p>
            <p className="text-xs text-emerald-400 font-semibold">{coupon.label} applied</p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 flex items-center gap-2">
          <AlertCircle size={13} />{error}
        </p>
      )}

      {/* Pay button */}
      <button
        onClick={handlePay}
        disabled={loading}
        className={clsx(
          'w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-bold text-base transition-all shadow-xl active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed',
          plan.key === 'premium'
            ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-amber-500/25 hover:from-amber-400 hover:to-yellow-300'
            : 'bg-gradient-to-r from-primary-600 to-accent-500 text-white shadow-primary-600/30 hover:opacity-90'
        )}
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Connecting to TBC…
          </>
        ) : (
          <>
            <Lock size={16} />
            Pay ₾{total.toFixed(2)} via TBC Bank
            <ExternalLink size={14} className="opacity-70" />
          </>
        )}
      </button>

      <p className="text-xs text-slate-600 text-center leading-relaxed">
        By completing your purchase you agree to our{' '}
        <Link to="/terms" className="text-primary-400 hover:text-primary-300 transition-colors">Terms</Link>
        {' '}and{' '}
        <Link to="/privacy" className="text-primary-400 hover:text-primary-300 transition-colors">Privacy Policy</Link>.
        Payments processed securely by TBC Bank.
      </p>

      <div className="flex items-center justify-center gap-2 pt-1">
        <div className="w-6 h-6 rounded bg-[#FF6600]/10 border border-[#FF6600]/20 flex items-center justify-center">
          <span className="text-[#FF6600] font-black text-[8px]">TBC</span>
        </div>
        <span className="text-xs font-semibold text-slate-500">TBC Bank</span>
        <span className="text-slate-700 text-xs">·</span>
        <Shield size={11} className="text-emerald-400" />
        <span className="text-xs text-slate-500">SSL Secured</span>
        <span className="text-slate-700 text-xs">·</span>
        <span className="text-xs text-slate-500">Visa / Mastercard</span>
      </div>
    </div>
  );
}

/* ── Verifying Screen (shown after redirect back from TBC) ── */
function VerifyingScreen() {
  return (
    <div className="text-center space-y-5 py-12 animate-fade-in-up">
      <div className="w-16 h-16 rounded-full border-2 border-primary-500/30 border-t-primary-500 animate-spin mx-auto" />
      <div>
        <h3 className="text-lg font-bold text-white mb-1">Verifying your payment…</h3>
        <p className="text-sm text-slate-500">Please wait, this takes just a moment.</p>
      </div>
    </div>
  );
}

/* ── Main Purchase Page ── */
export default function Purchase() {
  usePageTitle('Purchase');
  const navigate        = useNavigate();
  const [searchParams]  = useSearchParams();

  const initPlan    = searchParams.get('plan');
  const initBilling = searchParams.get('billing');
  const provider    = searchParams.get('provider');    // 'tbc' when returning from TBC
  const mpid        = searchParams.get('mpid');        // merchantPaymentId from TBC return
  const isCanceled  = searchParams.get('canceled') === 'true';

  // Legacy Stripe return params (kept for backward compat)
  const sessionId   = searchParams.get('session_id');
  const isSuccess   = searchParams.get('success') === 'true';

  const validPlanKeys = ['pro', 'premium'];
  const startPlan = validPlanKeys.includes(initPlan) ? initPlan : 'pro';

  const [selectedPlan,   setSelectedPlan]   = useState(startPlan);
  const [annual,         setAnnual]         = useState(initBilling === 'annual');
  const [pageState,      setPageState]      = useState('checkout'); // 'checkout' | 'verifying' | 'success' | 'failed'
  const [canceledNotice, setCanceledNotice] = useState(isCanceled);

  const plan = PLANS[selectedPlan] || PLANS.pro;

  /**
   * Verify TBC payment after user returns from TBC's payment page.
   *
   * WHY we call this instead of trusting the URL params?
   *   The URL params can be faked — anyone can visit /purchase?provider=tbc&mpid=xxx.
   *   We call our backend which calls TBC's API with our auth token to get the real status.
   *
   * WHY the webhook is still the primary signal?
   *   This is a UX fallback. The webhook fires server-to-server regardless of what the
   *   user's browser does. If the webhook already ran, this call just reads our DB.
   *   If the webhook is delayed, this call fetches from TBC directly.
   */
  const verifyTbcReturn = useCallback(async (merchantPaymentId) => {
    setPageState('verifying');
    try {
      const res = await fetch(
        `${SERVER_URL}/api/payments/tbc/verify/${merchantPaymentId}`,
        { credentials: 'include' }
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Verification failed');

      const { paymentStatus } = data.data;

      if (paymentStatus === 'succeeded') {
        // Update selected plan display to match what was actually purchased
        if (data.data.plan && PLANS[data.data.plan]) {
          setSelectedPlan(data.data.plan);
        }
        setPageState('success');
      } else if (paymentStatus === 'failed') {
        setPageState('failed');
      } else {
        // Still pending — show verifying for a bit then retry
        setTimeout(() => verifyTbcReturn(merchantPaymentId), 3000);
      }
    } catch (err) {
      console.error('TBC verification error:', err.message);
      setPageState('failed');
    }
  }, []);

  // Handle return from TBC payment page
  useEffect(() => {
    if (provider === 'tbc' && mpid) {
      verifyTbcReturn(mpid);
    }
  }, [provider, mpid, verifyTbcReturn]);

  // Handle legacy Stripe redirect (kept for backward compat)
  useEffect(() => {
    if (!isSuccess || !sessionId) return;
    fetch(`${SERVER_URL}/api/payments/verify-session/${sessionId}`, {
      credentials: 'include',
    })
      .then(r => r.json())
      .then(data => { if (data.status === 'success') setPageState('success'); })
      .catch(() => setPageState('success'));
  }, [isSuccess, sessionId]);

  return (
    <div className="min-h-screen bg-[#070712] flex flex-col">

      {/* ── Header ── */}
      <header className="border-b border-[#1A1A3E] bg-[#070712]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-600/30 transition-transform group-hover:scale-105">
              <BrainCircuit size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-white">
              Mentora <span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
              <Shield size={12} className="text-emerald-400" />
              Secured by TBC Bank
            </div>
            <Link to="/pricing" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
              ← Back to Pricing
            </Link>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <main className="flex-1 flex items-start justify-center py-12 px-6">
        <div className="w-full max-w-5xl">

          {/* Steps indicator (only when on checkout) */}
          {pageState === 'checkout' && (
            <div className="flex items-center justify-center gap-3 mb-10">
              {['Choose Plan', 'Payment Details', 'Confirmation'].map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <div className={clsx(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                    i < 2
                      ? 'bg-gradient-to-r from-primary-600 to-accent-500 text-white'
                      : 'bg-[#1A1A3E] text-slate-600'
                  )}>
                    {i < 2 ? <Check size={12} strokeWidth={3} /> : i + 1}
                  </div>
                  <span className={clsx('text-xs font-medium hidden sm:block', i < 2 ? 'text-slate-300' : 'text-slate-600')}>{step}</span>
                  {i < 2 && <div className={clsx('w-8 h-px', i < 1 ? 'bg-primary-500/50' : 'bg-[#1A1A3E]')} />}
                </div>
              ))}
            </div>
          )}

          {/* Canceled notice */}
          {canceledNotice && pageState === 'checkout' && (
            <div className="flex items-center justify-between gap-3 mb-6 rounded-xl border border-amber-500/30 bg-amber-500/8 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-amber-400">
                <AlertCircle size={15} />
                Payment was canceled. No charge was made — you can try again below.
              </div>
              <button onClick={() => setCanceledNotice(false)} className="text-slate-500 hover:text-slate-300 transition-colors shrink-0">
                <X size={14} />
              </button>
            </div>
          )}

          {/* ── State machine ── */}
          {pageState === 'verifying' && (
            <div className="max-w-md mx-auto">
              <VerifyingScreen />
            </div>
          )}

          {pageState === 'success' && (
            <div className="max-w-md mx-auto">
              <SuccessScreen plan={plan} />
            </div>
          )}

          {pageState === 'failed' && (
            <div className="max-w-md mx-auto">
              <FailedScreen onRetry={() => {
                setPageState('checkout');
                // Clean URL params
                navigate('/purchase', { replace: true });
              }} />
            </div>
          )}

          {pageState === 'checkout' && (
            <div className="grid lg:grid-cols-[1fr_440px] gap-8 items-start">

              {/* ── LEFT: plan picker + payment form ── */}
              <div className="space-y-6">

                {/* Plan & billing selector */}
                <div className="rounded-2xl border border-[#1A1A3E] bg-[#0D0D1F] p-5 space-y-5">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Select Plan</p>
                    <PlanSelector selected={selectedPlan} setSelected={setSelectedPlan} annual={annual} />
                  </div>

                  <div className="h-px bg-[#1A1A3E]" />

                  {/* Billing toggle */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Billing Period</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: false, label: 'Monthly', sub: 'Pay month to month' },
                        { key: true,  label: 'Annual',  sub: `Save ${selectedPlan === 'pro' ? '32' : '31'}%` },
                      ].map(({ key, label, sub }) => (
                        <button
                          key={String(key)}
                          onClick={() => setAnnual(key)}
                          className={clsx(
                            'rounded-xl border p-3 text-left transition-all',
                            annual === key
                              ? 'border-primary-500/50 bg-primary-500/8 ring-1 ring-primary-500/20'
                              : 'border-[#1A1A3E] bg-[#070712] hover:border-[#2a2a5e]'
                          )}
                        >
                          <div className="flex items-center justify-between mb-0.5">
                            <p className="text-sm font-bold text-white">{label}</p>
                            {key && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">Best deal</span>}
                          </div>
                          <p className="text-xs text-slate-500">{sub}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* TBC Payment form */}
                <div className="rounded-2xl border border-[#1A1A3E] bg-[#0D0D1F] p-5">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-base font-bold text-white">Payment Details</h2>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Lock size={11} className="text-emerald-400" /> SSL secured
                    </div>
                  </div>
                  <TbcCheckoutForm
                    key={selectedPlan + String(annual)}
                    plan={plan}
                    annual={annual}
                    onSuccess={() => setPageState('success')}
                    onFail={() => setPageState('failed')}
                  />
                </div>
              </div>

              {/* ── RIGHT: Order summary ── */}
              <div className="lg:sticky lg:top-28">
                <div className="rounded-2xl border border-[#1A1A3E] bg-[#0D0D1F] p-5">
                  <h2 className="text-base font-bold text-white mb-5">Order Summary</h2>
                  <OrderSummary plan={plan} annual={annual} coupon={null} />
                </div>
              </div>

            </div>
          )}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-[#1A1A3E] py-6 px-6 text-center">
        <p className="text-xs text-slate-600">
          © 2026 Mentora AI · {' '}
          <Link to="/privacy" className="hover:text-slate-400 transition-colors">Privacy</Link>
          {' '} · {' '}
          <Link to="/terms" className="hover:text-slate-400 transition-colors">Terms</Link>
          {' '} · {' '}
          <Link to="/contact" className="hover:text-slate-400 transition-colors">Support</Link>
        </p>
      </footer>
    </div>
  );
}
