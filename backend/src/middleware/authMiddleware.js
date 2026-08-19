import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';
import { errorResponse } from '../utils/apiResponse.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return errorResponse(res, 'Not authorized, token missing', null, 401);
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return errorResponse(res, 'User associated with token no longer exists', null, 401);
    }
    next();
  } catch (error) {
    return errorResponse(res, 'Not authorized, invalid or expired token', error.message, 401);
  }
};

export const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, env.jwtSecret);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Ignore token failure for optional auth
    }
  }
  next();
};
