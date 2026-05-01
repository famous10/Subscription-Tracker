var aj = require('../config/arcjet');

// ─── Arcjet Middleware ────────────────────────────────────────────────────────
var arcjetMiddleware = async (req, res, next) => {
  try {
    var decision = await aj.protect(req, { requested: 1 });

    console.log('Arcjet decision:', decision.conclusion, decision.reason);

    // ─── Deny: Block the request ──────────────────────────────────────────────
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ success: false, message: 'Too many requests. Please try again later.' });
      }

      if (decision.reason.isBot()) {
        return res.status(403).json({ success: false, message: 'Bot detected. Access denied.' });
      }

      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    next();
  } catch (error) {
    // Fail open in development — don't block requests if Arcjet errors
    console.error('Arcjet error:', error.message);
    next();
  }
};

module.exports = arcjetMiddleware;
