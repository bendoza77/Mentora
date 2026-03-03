/* ─────────────────────────────────────────────────────────────────────────────
 * planGate.js
 * Middleware factory for plan-based feature gating.
 *
 * Usage:
 *   router.post('/some-route', protect, requirePlan('pro'), handler);
 *
 * PLAN_RANK lets you compare plans numerically:
 *   free < pro < premium
 * ───────────────────────────────────────────────────────────────────────────── */

const PLAN_RANK = { free: 0, pro: 1, premium: 2 };

/**
 * Returns middleware that rejects requests whose user's plan is below minPlan.
 * @param {'pro'|'premium'} minPlan  Minimum plan required
 */
const requirePlan = (minPlan) => (req, res, next) => {
    const userRank     = PLAN_RANK[req.user?.plan] ?? 0;
    const requiredRank = PLAN_RANK[minPlan]         ?? 0;

    if (userRank < requiredRank) {
        return res.status(403).json({
            status:       'fail',
            code:         'PLAN_REQUIRED',
            requiredPlan: minPlan,
            message:      `This feature requires the ${minPlan} plan or higher.`,
        });
    }
    next();
};

module.exports = { requirePlan, PLAN_RANK };
