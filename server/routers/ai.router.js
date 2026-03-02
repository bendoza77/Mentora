const express    = require('express');
const rateLimit  = require('express-rate-limit');
const { chat }   = require('../controllers/ai.controller');
const protect    = require('../middlewares/auth.middleware');

const aiRouter = express.Router();

// Dedicated limiter: 30 AI requests per 15 min per IP (authenticated users)
const aiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: 'Too many AI requests. Please wait a few minutes before trying again.',
    standardHeaders: true,
    legacyHeaders:   false,
});

// Stricter limiter for the public landing page demo (no login required)
const demoLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Demo limit reached. Sign up for unlimited AI access.',
    standardHeaders: true,
    legacyHeaders:   false,
});

// POST /api/ai/chat  — authenticated users
aiRouter.post('/chat', protect, aiLimiter, chat);

// POST /api/ai/demo  — public, landing page demo
aiRouter.post('/demo', demoLimiter, chat);

module.exports = aiRouter;
