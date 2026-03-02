// /**
//  * TBC Bank eCommerce Payment Service
//  * ====================================
//  * Handles all server-to-server communication with TBC Bank's REST API.
//  *
//  * FLOW:
//  *  1. We authenticate using OAuth2 client_credentials → get short-lived access_token
//  *  2. We use that token to create a hosted-payment-page session at TBC
//  *  3. TBC returns a paymentUrl — we redirect the user there
//  *  4. User pays on TBC's page; TBC POSTs the result to our webhook
//  *  5. Webhook verifies the result by calling TBC directly (never trust webhook body alone)
//  *
//  * ENVIRONMENT VARIABLES REQUIRED:
//  *  TBC_ENV              = 'sandbox' | 'production'
//  *  TBC_CLIENT_ID        = your merchant client_id from TBC portal
//  *  TBC_CLIENT_SECRET    = your merchant client_secret from TBC portal
//  *  TBC_SANDBOX_AUTH_URL = sandbox OAuth token endpoint (from TBC docs)
//  *  TBC_SANDBOX_API_URL  = sandbox API base URL (from TBC docs)
//  *  TBC_PROD_AUTH_URL    = production OAuth token endpoint
//  *  TBC_PROD_API_URL     = production API base URL
//  *
//  * TBC DEVELOPER PORTAL: https://developers.tbcbank.ge
//  */

// const axios = require('axios');

// // ── Resolve environment (sandbox vs production) ──────────────────────────────
// const IS_SANDBOX = process.env.TBC_ENV !== 'production';

// const TBC_AUTH_URL = IS_SANDBOX
//     ? process.env.TBC_SANDBOX_AUTH_URL   // e.g. https://api.tbcbank.ge/v1/tbc-pay/access-token
//     : process.env.TBC_PROD_AUTH_URL;

// const TBC_API_BASE = IS_SANDBOX
//     ? process.env.TBC_SANDBOX_API_URL    // e.g. https://api.tbcbank.ge
//     : process.env.TBC_PROD_API_URL;

// const TBC_CLIENT_ID     = process.env.TBC_CLIENT_ID;
// const TBC_CLIENT_SECRET = process.env.TBC_CLIENT_SECRET;

// // ── In-memory OAuth token cache ──────────────────────────────────────────────
// // WHY cache?
// //   TBC access tokens expire after ~3600 seconds.
// //   Creating a new token on every request is wasteful and slows things down.
// //   We cache the token and only refresh it when it's about to expire.
// let _cachedToken     = null;
// let _tokenExpiresAt  = 0; // Unix ms timestamp

// /**
//  * Returns a valid OAuth2 access token.
//  * Fetches a fresh one from TBC if the cached token is expired or missing.
//  *
//  * WHY OAuth2 client_credentials here?
//  *   This is a machine-to-machine (M2M) auth flow — our server authenticates
//  *   itself to TBC using a pre-issued client_id + client_secret.
//  *   The secret NEVER leaves the backend. The frontend never sees it.
//  */
// const getAccessToken = async () => {
//     // Return cached token if it's still valid (subtract 60s as safety buffer)
//     const now = Date.now();
//     if (_cachedToken && now < _tokenExpiresAt - 60_000) {
//         return _cachedToken;
//     }

//     if (!TBC_CLIENT_ID || !TBC_CLIENT_SECRET) {
//         throw new Error('TBC credentials not configured. Check TBC_CLIENT_ID and TBC_CLIENT_SECRET in .env');
//     }

//     if (!TBC_AUTH_URL) {
//         throw new Error('TBC auth URL not configured. Check TBC_SANDBOX_AUTH_URL or TBC_PROD_AUTH_URL in .env');
//     }

//     // Request a new token using client_credentials grant
//     const response = await axios.post(
//         TBC_AUTH_URL,
//         new URLSearchParams({
//             grant_type:    'client_credentials',
//             client_id:     TBC_CLIENT_ID,
//             client_secret: TBC_CLIENT_SECRET,
//         }).toString(),
//         {
//             headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//             timeout: 10_000, // 10 second timeout
//         }
//     );

//     const { access_token, expires_in } = response.data;

//     // Cache the new token
//     _cachedToken    = access_token;
//     _tokenExpiresAt = Date.now() + (expires_in * 1000);

//     console.log(`[TBC] New access token acquired (${IS_SANDBOX ? 'SANDBOX' : 'PRODUCTION'}). Expires in ${expires_in}s.`);

//     return _cachedToken;
// };

// /**
//  * Create a new payment session at TBC.
//  * Returns TBC's response which includes `payId` and a `links` array
//  * containing the redirect URL (rel: "formUrl") for the user.
//  *
//  * @param {object}  params
//  * @param {string}  params.merchantPaymentId  - Your unique internal payment ID (used for idempotency)
//  * @param {number}  params.amount             - Amount in tetri (1 GEL = 100 tetri). E.g. 1900 = ₾19.00
//  * @param {string}  params.currency           - ISO currency code, default 'GEL'
//  * @param {string}  params.returnUrl          - Where TBC redirects the user after payment (success or fail)
//  * @param {string}  params.hookUrl            - Server endpoint TBC POSTs the payment result to (webhook)
//  * @param {string}  [params.description]      - Description shown to user on TBC's payment page
//  * @param {string}  [params.lang]             - Language code for TBC's UI: 'KA' (Georgian) or 'EN'
//  *
//  * @returns {object} TBC API response:
//  *   {
//  *     payId: "abc123",
//  *     status: "Created",
//  *     links: [
//  *       { href: "https://ecommerce.tbcbank.ge/...", rel: "formUrl", method: "GET" }
//  *     ]
//  *   }
//  */
// const createPayment = async ({
//     merchantPaymentId,
//     amount,
//     currency = 'GEL',
//     returnUrl,
//     hookUrl,
//     description = 'Mentora AI Subscription',
//     lang = 'KA',
// }) => {
//     if (!TBC_API_BASE) {
//         throw new Error('TBC API base URL not configured. Check TBC_SANDBOX_API_URL or TBC_PROD_API_URL in .env');
//     }

//     const token = await getAccessToken();

//     // Build the TBC payment payload
//     // NOTE: 'amount.total' is in tetri (smallest GEL unit), NOT in GEL.
//     //       ₾19.00 = 1900 tetri
//     const payload = {
//         amount: {
//             currency,
//             total: amount, // in tetri
//         },
//         returnUrl,          // user is sent here after paying (regardless of success/fail)
//         extra: description, // displayed on TBC's hosted page
//         merchantPaymentId,  // your internal ID — TBC stores this for reference
//         lang,               // 'KA' = Georgian, 'EN' = English
//         hookUrl,            // TBC POSTs payment result here (webhook)
//     };

//     const response = await axios.post(
//         `${TBC_API_BASE}/v1/tbc-pay/payments`,
//         payload,
//         {
//             headers: {
//                 Authorization:  `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//             },
//             timeout: 15_000,
//         }
//     );

//     return response.data;
// };

// /**
//  * Retrieve the current status of a payment from TBC.
//  *
//  * WHY do we call this inside our webhook instead of trusting the webhook body?
//  *   Because ANYONE can POST to our webhook endpoint with a fake payId.
//  *   By fetching status directly from TBC (using our authenticated token),
//  *   we independently verify what actually happened — not what someone claims happened.
//  *   This is called "server-side verification" and is a critical security step.
//  *
//  * @param {string} payId - TBC's payment ID (returned when payment was created)
//  * @returns {object} Payment status object from TBC:
//  *   {
//  *     payId, status, currency, amount, orderId, ...
//  *   }
//  *   Possible statuses: "Created", "Processing", "Succeeded", "Failed", "Reversed", "WaitingConfirm"
//  */
// const getPaymentStatus = async (payId) => {
//     if (!TBC_API_BASE) {
//         throw new Error('TBC API base URL not configured');
//     }

//     const token = await getAccessToken();

//     const response = await axios.get(
//         `${TBC_API_BASE}/v1/tbc-pay/payments/${payId}`,
//         {
//             headers: { Authorization: `Bearer ${token}` },
//             timeout: 10_000,
//         }
//     );

//     return response.data;
// };

// module.exports = { getAccessToken, createPayment, getPaymentStatus };
