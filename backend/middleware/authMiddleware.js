import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const JWT_SECRET = 'kjdfnjdnfjdjkfndkjnfdnkfnfkjfjsdfijrioerry'
  const token = req.headers['authorization'];
  console.log('Received token:', token);  // Log the header value

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    console.log('Verifying token:', actualToken);
    const decoded = jwt.verify(actualToken, JWT_SECRET);
    req.userId = decoded.userId;
    return next();
  } catch (error) {
    console.error('JWT verification error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

