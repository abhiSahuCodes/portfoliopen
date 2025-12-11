const usageStore = new Map(); // Keeps count in memory

const aiLimiter = (req, res, next) => {
  // 1. Identify User: Prefer ID, fallback to IP
  const key = String(req.user?.id || req.ip);
  
  // 2. Set Limit: Check Admin email from .env
  const limit = (req.user?.email === process.env.ADMIN_EMAIL) ? 100 : 5;
  const windowMs = 24 * 60 * 60 * 1000; // 24 Hours in milliseconds
  const now = Date.now();

  // 3. Initialize if new user
  if (!usageStore.has(key)) {
    usageStore.set(key, { count: 0, resetTime: now + windowMs });
  }

  const record = usageStore.get(key);

  // 4. Reset if 24 hours passed
  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + windowMs;
  }

  // 5. BLOCK if limit reached
  if (record.count >= limit) {
    console.warn(`🛑 [RateLimit] BLOCKED User: ${key} | Limit: ${limit}`);
    return res.status(429).json({
      success: false,
      message: `Daily AI limit reached (${limit} requests/day).`,
      code: "RATE_LIMIT_EXCEEDED"
    });
  }

  // 6. Increment and Allow
  record.count += 1;
  console.log(`🛡️ [RateLimit] User: ${key} | Count: ${record.count}/${limit}`);
  
  next();
};

module.exports = aiLimiter;