const { store } = require('../data/store');

// Simple token-based auth (for demo purposes)
// In production, use JWT or proper session management
const tokens = new Map();

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token || !tokens.has(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  req.user = tokens.get(token);
  next();
}

function setToken(token, user) {
  tokens.set(token, user);
}
module.exports = { authMiddleware, setToken };
