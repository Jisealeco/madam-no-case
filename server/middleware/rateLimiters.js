import rateLimit from 'express-rate-limit';

const handler = (message) => (req, res) => res.status(429).json({ success: false, message });

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: handler('Too many requests, please slow down.'),
});

export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: handler('You have sent several messages already. Please call or WhatsApp us instead.'),
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: handler('Too many login attempts. Try again in 15 minutes.'),
});
