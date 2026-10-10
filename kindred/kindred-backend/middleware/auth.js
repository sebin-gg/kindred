import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

function getJwtSecret(res) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // Fail closed: the server is misconfigured, never accept tokens.
    res.status(500).json({ error: 'Server authentication is not configured' });
    return null;
  }
  return secret;
}

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const [scheme, token] = (authHeader || '').split(' ');

  if (!token || scheme !== 'Bearer') {
    return res.status(401).json({ error: 'Access token required' });
  }

  const secret = getJwtSecret(res);
  if (!secret) return;

  jwt.verify(token, secret, (err, user) => {
    if (err || !user || typeof user.id !== 'string') {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

export default authenticateToken;
