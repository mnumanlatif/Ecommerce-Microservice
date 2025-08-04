const jwt = require('jsonwebtoken');
const { AppError } = require('../../shared/middleware/errorHandler');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

function verifyToken(req, res, next) {
  const token =
    req.cookies?.accessToken || // read JWT from cookie
    (req.headers['authorization'] || req.headers['Authorization'])?.split(' ')[1]; // fallback to Bearer token

  if (!token) return next(new AppError('No token provided', 401));

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return next(new AppError('Token is not valid', 403));
    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;
