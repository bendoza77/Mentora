// const crypto = require('crypto');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const User = require('../models/user.model');
// const Payment = require('../models/payment.model');
// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/AppError');
// const { createPayment, getPaymentStatus } = require('../services/tbcPaymentService');

// /* ── Plan prices in smallest currency unit (tetri = 1/100 GEL) ── */
// const PRICES = {
//     pro: {
//         monthly: 1900,   // ₾19.00
//         annual:  15600,  // ₾156.00
//     },
//     premium: {
//         monthly: 3500,   // ₾35.00
//         annual:  28800,  // ₾288.00
//     },
// };

// const COUPON_DISCOUNTS = {
//     MENTORA20: 0.20,
//     STUDENT10: 0.10,
//     ENT2025:   0.15,
// };

// /* ═══════════════════════════════════════════════════════════════════════════
//  * TBC BANK PAYMENT HANDLERS
//  * ═══════════════════════════════════════════════════════════════════════════ */

// /* ── Create TBC Payment Session ─────────────────────────────────────────────
//  * Called by frontend "Pay with TBC" button.
//  * Returns a `paymentUrl` that we redirect the user to.
//  *
//  * WHY redirect and not embed?
//  *   TBC provides a hosted payment page — PCI-DSS compliant out of the box.
//  *   Card data goes directly to TBC; our servers never touch it.
//  */
// const createTbcPayment = catchAsync(async (req, res, next) => {
//     const { plan, billing, coupon } = req.body;
//     const userId = req.user._id.toString();

//     // Validate plan
//     if (!['pro', 'premium'].includes(plan)) {
//         return next(new AppError('Invalid plan selected', 400));
//     }

//     // Validate billing
//     const billingMode = billing === 'annual' ? 'annual' : 'monthly';

//     // Calculate amount in tetri
//     let amount = PRICES[plan][billingMode];
//     if (coupon) {
//         const discount = COUPON_DISCOUNTS[coupon.toUpperCase()];
//         if (discount) amount = Math.round(amount * (1 - discount));
//     }

//     // Generate a globally unique merchant payment ID.
//     // WHY generate it here (before calling TBC)?
//     //   If TBC call fails, we still have a record in our DB.
//     //   If TBC somehow charges without our DB record (rare edge case),
//     //   the merchantPaymentId lets us reconcile later.
//     const merchantPaymentId =
//         `mentora-${userId.slice(-6)}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

//     // Build redirect URL — TBC sends user here after payment (success OR failure)
//     // We include merchantPaymentId so we can look up the payment on return.
//     const returnUrl  = `${process.env.CLIENT_URL}/purchase?provider=tbc&mpid=${merchantPaymentId}`;

//     // Webhook URL — TBC POSTs result here server-to-server (the reliable signal)
//     // In development: use ngrok → https://xxxx.ngrok.io/api/payments/tbc/webhook
//     // In production:  your real domain → https://api.mentora.ge/api/payments/tbc/webhook
//     const hookUrl = `${process.env.SERVER_URL}/api/payments/tbc/webhook`;

//     // 1. Create pending record BEFORE calling TBC (so we have a paper trail)
//     let payment;
//     try {
//         payment = await Payment.create({
//             userId,
//             merchantPaymentId,
//             provider: 'tbc',
//             plan,
//             billing: billingMode,
//             amount,
//             currency: 'gel',
//             status: 'pending',
//         });
//     } catch (err) {
//         console.error('[TBC] Failed to create payment record in DB:', err.message);
//         return next(new AppError('Failed to initialize payment. Please try again.', 500));
//     }

//     // 2. Call TBC API to create the payment session
//     let tbcResponse;
//     try {
//         tbcResponse = await createPayment({
//             merchantPaymentId,
//             amount,
//             currency: 'GEL',
//             returnUrl,
//             hookUrl,
//             description: `Mentora AI — ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan (${billingMode})`,
//             lang: 'KA',
//         });
//     } catch (err) {
//         // TBC call failed — mark our record as failed
//         await Payment.findByIdAndUpdate(payment._id, { status: 'failed' }).catch(() => {});
//         console.error('[TBC] createPayment API error:', err.response?.data || err.message);
//         return next(new AppError('Could not connect to TBC Bank. Please try again.', 502));
//     }

//     // 3. Extract the hosted payment page URL from TBC's response
//     //    TBC returns: { payId, status, links: [{ href, rel, method }] }
//     //    The link with rel="formUrl" is the URL we send the user to.
//     const paymentUrl = tbcResponse.links?.find(l => l.rel === 'formUrl')?.href;

//     if (!paymentUrl) {
//         await Payment.findByIdAndUpdate(payment._id, { status: 'failed' }).catch(() => {});
//         console.error('[TBC] No formUrl in TBC response:', JSON.stringify(tbcResponse));
//         return next(new AppError('TBC did not return a payment URL. Please try again.', 502));
//     }

//     // 4. Store TBC's payId on our record (needed for webhook lookup)
//     await Payment.findByIdAndUpdate(payment._id, { tbcPayId: tbcResponse.payId });

//     console.log(`[TBC] Payment session created | mpid=${merchantPaymentId} | payId=${tbcResponse.payId} | amount=₾${(amount / 100).toFixed(2)}`);

//     // 5. Return the payment URL to the frontend
//     res.json({
//         status: 'success',
//         data: {
//             paymentUrl,        // frontend redirects user here
//             merchantPaymentId, // frontend stores for verification on return
//         },
//     });
// });

// /* ── TBC Webhook ─────────────────────────────────────────────────────────────
//  *
//  * WHY do we need a webhook?
//  *   The user's browser redirect back to our site is NOT reliable:
//  *     a) User can close the tab mid-payment
//  *     b) Network can fail between TBC's page and ours
//  *     c) Browser redirect can be manipulated
//  *   A webhook is a direct server-to-server POST from TBC — completely independent
//  *   of what the user's browser does. It's the only trustworthy signal.
//  *
//  * WHY do we call TBC back instead of trusting the webhook body?
//  *   ANYONE can POST a fake webhook to our endpoint. Without verification,
//  *   a malicious user could claim their payment succeeded and get a free plan.
//  *   We always call `getPaymentStatus(payId)` with our auth token to get
//  *   the real status directly from TBC's servers.
//  *
//  * WHY do we return 200 even on errors?
//  *   If we return 4xx/5xx, TBC will retry the webhook. Retrying a genuinely
//  *   errored webhook (bad DB call, etc.) can cause double-processing.
//  *   We return 200 always, and use `webhookProcessed` flag to prevent duplicates.
//  */
// const tbcWebhook = async (req, res) => {
//     try {
//         const { payId } = req.body;

//         if (!payId) {
//             console.warn('[TBC Webhook] Received request without payId');
//             return res.status(400).json({ error: 'Missing payId' });
//         }

//         console.log(`[TBC Webhook] Received: payId=${payId}`);

//         // ── STEP 1: Verify payment status directly with TBC ──────────────────
//         // Never trust the webhook body — call TBC with our token to get real status.
//         let tbcPayment;
//         try {
//             tbcPayment = await getPaymentStatus(payId);
//         } catch (err) {
//             console.error('[TBC Webhook] Failed to verify with TBC API:', err.message);
//             // Return 200 so TBC doesn't retry — we'll verify next time user visits success page
//             return res.status(200).json({ received: true });
//         }

//         const verifiedStatus = tbcPayment.status;
//         console.log(`[TBC Webhook] Verified status from TBC: ${verifiedStatus}`);

//         // ── STEP 2: Find our payment record ──────────────────────────────────
//         const payment = await Payment.findOne({ tbcPayId: payId });

//         if (!payment) {
//             // Could be a test event or a race condition — not an error
//             console.warn(`[TBC Webhook] No payment record found for payId=${payId}`);
//             return res.status(200).json({ received: true });
//         }

//         // ── STEP 3: Prevent double-processing (idempotency) ──────────────────
//         // If we already processed this webhook, silently acknowledge and exit.
//         if (payment.webhookProcessed) {
//             console.log(`[TBC Webhook] Already processed (skipping): payId=${payId}`);
//             return res.status(200).json({ received: true });
//         }

//         // ── STEP 4: Map TBC status to our internal status ─────────────────────
//         const isSucceeded = verifiedStatus === 'Succeeded';
//         const isFailed    = verifiedStatus === 'Failed' || verifiedStatus === 'Reversed';

//         if (isSucceeded) {
//             // Payment confirmed → update payment record AND activate user's plan
//             await Payment.findByIdAndUpdate(payment._id, {
//                 status:           'succeeded',
//                 webhookProcessed: true,
//             });

//             await User.findByIdAndUpdate(payment.userId, { plan: payment.plan });

//             console.log(`[TBC Webhook] SUCCESS | payId=${payId} | user=${payment.userId} | plan=${payment.plan}`);

//         } else if (isFailed) {
//             await Payment.findByIdAndUpdate(payment._id, {
//                 status:           'failed',
//                 webhookProcessed: true,
//             });

//             console.log(`[TBC Webhook] FAILED | payId=${payId}`);

//         } else {
//             // Status like "Processing" or "WaitingConfirm" — not final yet, do nothing
//             console.log(`[TBC Webhook] Non-final status (no action): ${verifiedStatus}`);
//         }

//         // Always return 200 to acknowledge receipt
//         return res.status(200).json({ received: true });

//     } catch (err) {
//         console.error('[TBC Webhook] Unexpected error:', err.message);
//         // Return 200 to prevent TBC retrying — unexpected errors should be investigated in logs
//         return res.status(200).json({ received: true });
//     }
// };

// /* ── Verify TBC Payment (called from frontend success/return page) ───────────
//  *
//  * WHY this endpoint?
//  *   After TBC redirects the user back to our site, we show them their payment
//  *   status. We can't rely on query params (tampered easily) — we check our DB.
//  *
//  *   WHY NOT use this to activate the plan?
//  *   This is a fallback for UX only. The webhook is the authoritative signal.
//  *   If the webhook already ran, the plan is already active. If it hasn't run
//  *   yet (rare delay), we call TBC here as a backup to catch up.
//  */
// const verifyTbcPayment = catchAsync(async (req, res, next) => {
//     const { merchantPaymentId } = req.params;
//     const userId = req.user._id.toString();

//     // Find the payment record — must belong to this user
//     const payment = await Payment.findOne({ merchantPaymentId, userId });

//     if (!payment) {
//         return next(new AppError('Payment record not found', 404));
//     }

//     // If not yet processed by webhook, try to fetch from TBC directly as a fallback
//     if (payment.tbcPayId && !payment.webhookProcessed && payment.status === 'pending') {
//         try {
//             const tbcPayment = await getPaymentStatus(payment.tbcPayId);

//             if (tbcPayment.status === 'Succeeded') {
//                 // Webhook was delayed — activate plan now
//                 await Payment.findByIdAndUpdate(payment._id, {
//                     status:           'succeeded',
//                     webhookProcessed: true,
//                 });
//                 await User.findByIdAndUpdate(userId, { plan: payment.plan });
//                 payment.status = 'succeeded';
//                 console.log(`[TBC Verify] Fallback plan activation: user=${userId} plan=${payment.plan}`);

//             } else if (tbcPayment.status === 'Failed' || tbcPayment.status === 'Reversed') {
//                 await Payment.findByIdAndUpdate(payment._id, { status: 'failed' });
//                 payment.status = 'failed';
//             }
//         } catch (err) {
//             // Non-fatal: return what we have from DB
//             console.warn('[TBC Verify] Could not fetch live status from TBC:', err.message);
//         }
//     }

//     const user = await User.findById(userId);

//     return res.json({
//         status: 'success',
//         data: {
//             paymentStatus: payment.status,
//             plan:          payment.plan,
//             billing:       payment.billing,
//             user,
//         },
//     });
// });

// module.exports = {
//     // TBC
//     createTbcPayment,
//     tbcWebhook,
//     verifyTbcPayment,
// };