// const express = require('express');
// const {
//     // TBC
//     createTbcPayment,
//     tbcWebhook,
//     verifyTbcPayment,
// } = require('../controllers/payment.controller');
// const protect = require('../middlewares/auth.middleware');

// const paymentRouter = express.Router();

// /* ── TBC Bank routes ─────────────────────────────────────────────────────────
//  *
//  * POST /api/payments/tbc/create
//  *   Protected (user must be logged in).
//  *   Creates a TBC payment session, returns a paymentUrl to redirect user to.
//  *
//  * POST /api/payments/tbc/webhook
//  *   PUBLIC — TBC Bank POSTs to this directly (no user session involved).
//  *   Must NOT use the `protect` middleware.
//  *   Uses regular JSON body (TBC sends JSON, unlike Stripe which needs raw body).
//  *
//  * GET /api/payments/tbc/verify/:merchantPaymentId
//  *   Protected. Called by the frontend success/return page to get payment status.
//  */
// paymentRouter.post('/tbc/create',                           protect, createTbcPayment);
// paymentRouter.post('/tbc/webhook',                                   tbcWebhook);      // no auth — TBC calls this
// paymentRouter.get('/tbc/verify/:merchantPaymentId',         protect, verifyTbcPayment);

// module.exports = paymentRouter;
