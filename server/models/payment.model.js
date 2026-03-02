/**
 * Payment Model
 * =============
 * Provider-agnostic payment record.
 * Supports both Stripe and TBC Bank (and future providers) without schema changes.
 *
 * Key design decisions:
 *  - `merchantPaymentId` is OUR internal unique ID (generated per payment)
 *  - `provider` tells us which gateway processed it
 *  - Provider-specific IDs (stripePaymentIntentId, tbcPayId) are sparse-indexed:
 *    unique when present, not required to exist
 *  - `webhookProcessed` is a replay-attack guard — once true, webhook is ignored
 */

const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        // Reference to the user who initiated this payment
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        // OUR internal unique payment ID (generated before calling any provider).
        // Used as `merchantPaymentId` in TBC requests for idempotency.
        // Format: "mentora-{userId}-{timestamp}-{random}"
        merchantPaymentId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        // Which payment gateway processed this payment.
        // Adding a new provider in the future requires no schema migration —
        // just add a new enum value and a new provider-specific ID field below.
        provider: {
            type: String,
            enum: ['stripe', 'tbc'],
            required: true,
            default: 'tbc',
        },

        // ── Stripe-specific ──────────────────────────────────────────────────
        // sparse: true → only indexed when the field is present (not null/undefined)
        // This allows the field to be absent (for TBC payments) while still
        // enforcing uniqueness when it IS present (for Stripe payments).
        stripePaymentIntentId: {
            type:   String,
            sparse: true,
        },

        // ── TBC-specific ─────────────────────────────────────────────────────
        // TBC's own payment ID, returned when we create the payment session.
        // We use this to look up the payment in our webhook handler.
        tbcPayId: {
            type:   String,
            sparse: true,
            index:  true,
        },

        // ── Plan info ────────────────────────────────────────────────────────
        plan: {
            type: String,
            enum: ['pro', 'premium'],
        },

        billing: {
            type: String,
            enum: ['monthly', 'annual'],
        },

        // Amount in tetri (smallest GEL unit). 1 GEL = 100 tetri.
        // E.g. 1900 = ₾19.00, 3500 = ₾35.00
        amount: {
            type:     Number,
            required: true,
        },

        currency: {
            type:     String,
            required: true,
            default:  'gel',
        },

        // Payment lifecycle status
        status: {
            type:    String,
            enum:    ['pending', 'succeeded', 'failed'],
            default: 'pending',
        },

        // ── Replay attack protection ─────────────────────────────────────────
        // WHY this field?
        //   Webhook endpoints can receive the same event multiple times (TBC retries
        //   if our server responds with an error or times out).
        //   Without this guard, we could credit the user's plan multiple times.
        //   Once we process a webhook, we set this to true and skip any future
        //   processing for the same payId.
        webhookProcessed: {
            type:    Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
