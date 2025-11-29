const rateLimit = require('express-rate-limit');

exports.authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per minute (very generous for development)
  message: 'Too many attempts. Please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for localhost development
    const isLocalhost = req.ip === '127.0.0.1' ||
                       req.ip === '::1' ||
                       req.hostname === 'localhost' ||
                       req.connection.remoteAddress === '127.0.0.1' ||
                       req.connection.remoteAddress === '::1';
    console.log(`Rate limit check - IP: ${req.ip}, Hostname: ${req.hostname}, RemoteAddr: ${req.connection.remoteAddress}, Skip: ${isLocalhost}`);
    return isLocalhost;
  }
});
