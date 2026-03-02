const AppError = require('../utils/AppError');
const { streamToResponse } = require('../services/ai.service');

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
