const AppError = require('../utils/AppError');
const { streamToResponse } = require('../services/ai.service');
const User = require('../models/user.model');

const FREE_AI_DAILY_LIMIT = 5;

/* ── POST /api/ai/chat ────────────────────────────────────────────────────────
 * Accepts a conversation history and streams the AI response back via SSE.
 *
 * Request body:
 *   {
 *     messages: [
 *       { role: 'user',      content: 'Solve 2x + 5 = 11' },
 *       { role: 'assistant', content: '...' },
 *       { role: 'user',      content: 'Can you explain step 2?' }
 *     ]
 *   }
 *
 * Response: text/event-stream
 *   data: {"text":"partial chunk..."}
 *   data: {"text":"more text..."}
 *   data: [DONE]
 * ─────────────────────────────────────────────────────────────────────────── */
const chat = async (req, res, next) => {
    const { messages } = req.body;

    // ── Validate ─────────────────────────────────────────────────────────────
    if (!Array.isArray(messages) || messages.length === 0) {
        return next(new AppError('messages must be a non-empty array', 400));
    }

    const last = messages[messages.length - 1];
    if (!last || last.role !== 'user' || !String(last.content || '').trim()) {
        return next(new AppError('Last message must be a non-empty user message', 400));
    }

    // ── Free-plan daily limit ─────────────────────────────────────────────────
    if (req.user?.plan === 'free') {
        const today     = new Date(); today.setHours(0, 0, 0, 0);
        const aiUsage   = req.user.aiUsage || {};
        const isNewDay  = !aiUsage.resetDate || new Date(aiUsage.resetDate) < today;
        const usedToday = isNewDay ? 0 : (aiUsage.count || 0);

        if (usedToday >= FREE_AI_DAILY_LIMIT) {
            return res.status(429).json({
                status:  'fail',
                code:    'DAILY_AI_LIMIT',
                used:    usedToday,
                limit:   FREE_AI_DAILY_LIMIT,
                message: `You've used all ${FREE_AI_DAILY_LIMIT} free AI questions for today. Upgrade to Pro for unlimited access.`,
            });
        }

        // Increment counter atomically
        await User.findByIdAndUpdate(req.user._id, {
            'aiUsage.count':     isNewDay ? 1 : usedToday + 1,
            'aiUsage.resetDate': isNewDay ? today : aiUsage.resetDate,
        });
    }

    // ── SSE headers ───────────────────────────────────────────────────────────
    res.setHeader('Content-Type',  'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection',    'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // disable nginx buffering if behind proxy

    // Flush headers immediately so the client can start reading
    res.flushHeaders?.();

    // ── Stream ────────────────────────────────────────────────────────────────
    try {
        await streamToResponse(messages, res);
    } catch (err) {
        console.error('[AI] streaming error:', err.message || err);
        // If headers already sent we can only send an SSE error event
        if (!res.headersSent) {
            return next(new AppError('Mentora AI is unavailable right now. Try again soon.', 503));
        }
        // Otherwise signal the error through the stream
        res.write(`data: ${JSON.stringify({ error: 'AI stream interrupted. Please try again.' })}\n\n`);
        res.end();
    }
};

module.exports = { chat };
