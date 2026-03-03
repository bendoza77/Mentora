import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Zap, Crown } from 'lucide-react';

const PLAN_RANK  = { free: 0, pro: 1, premium: 2 };
const PLAN_ICON  = { pro: Zap, premium: Crown };
const PLAN_GRAD  = { pro: 'from-primary-600 to-accent-500', premium: 'from-amber-500 to-yellow-400' };
const PLAN_LABEL = { pro: 'Pro', premium: 'Premium' };

/**
 * Gates children behind a plan requirement.
 *
 * Props:
 *  - minPlan: 'pro' | 'premium'
 *  - compact: if true, renders a blurred overlay over the children instead of
 *             replacing them entirely (good for card-sized sections)
 *  - children: the content to show / hide
 */
export default function PlanGate({ minPlan, children, compact = false }) {
  const { user } = useAuth();
  const userRank     = PLAN_RANK[user?.plan ?? 'free'] ?? 0;
  const requiredRank = PLAN_RANK[minPlan] ?? 0;

  // User already has sufficient plan → just render children
  if (userRank >= requiredRank) return children;

  const Icon  = PLAN_ICON[minPlan]  || Zap;
  const grad  = PLAN_GRAD[minPlan]  || PLAN_GRAD.pro;
  const label = PLAN_LABEL[minPlan] || 'Pro';

  // ── Compact overlay mode ────────────────────────────────────────────────────
  // The children are rendered faded/blurred behind the lock UI.
  if (compact) {
    return (
      <div className="relative rounded-2xl overflow-hidden">
        {/* Faded preview of the locked content */}
        <div className="opacity-15 pointer-events-none select-none blur-[2px]">
          {children}
        </div>

        {/* Lock overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-dark-bg/75 backdrop-blur-sm">
          <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center shadow-lg`}>
            <Lock size={20} className="text-white" />
          </div>
          <p className="text-sm font-bold text-white">{label} Plan Required</p>
          <Link
            to="/pricing"
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r ${grad} text-white text-xs font-bold hover:opacity-90 transition-opacity shadow-md`}
          >
            <Icon size={12} /> Upgrade to {label}
          </Link>
        </div>
      </div>
    );
  }

  // ── Full replacement mode ────────────────────────────────────────────────────
  return (
    <div className="rounded-2xl border border-dark-border bg-dark-card p-10 flex flex-col items-center justify-center gap-5 text-center min-h-[220px]">
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center shadow-xl`}>
        <Lock size={28} className="text-white" />
      </div>
      <div>
        <p className="text-white font-bold text-lg mb-1">{label} Plan Required</p>
        <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
          Upgrade to {label} to unlock this feature and take your study to the next level.
        </p>
      </div>
      <Link
        to="/pricing"
        className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${grad} text-white font-bold hover:opacity-90 transition-opacity shadow-lg`}
      >
        <Icon size={16} /> Upgrade to {label}
      </Link>
    </div>
  );
}
