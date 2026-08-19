import { errorResponse } from '../utils/apiResponse.js';
import { sanitizeLanguage } from '../utils/validators.js';

export const validateLanguage = (req, res, next) => {
  const lang = req.query.lang || req.body.language || req.headers['accept-language'];
  req.lang = sanitizeLanguage(lang);
  next();
};

export const validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return errorResponse(res, 'Please provide name, email, and password.', null, 400);
  }
  if (password.length < 6) {
    return errorResponse(res, 'Password must be at least 6 characters long.', null, 400);
  }
  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return errorResponse(res, 'Please provide email and password.', null, 400);
  }
  next();
};
