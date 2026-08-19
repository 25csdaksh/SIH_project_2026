import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

const generateToken = (id) => {
  return jwt.sign({ id }, env.jwtSecret, {
    expiresIn: '30d'
  });
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, preferredLanguage } = req.body;

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return errorResponse(res, 'User with this email already exists.', null, 400);
    }

    const user = await User.create({
      name,
      email,
      password,
      preferredLanguage: preferredLanguage || 'en'
    });

    const token = generateToken(user._id);

    return successResponse(
      res,
      'User registered successfully',
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        preferredLanguage: user.preferredLanguage,
        token
      },
      201
    );
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return errorResponse(res, 'Invalid email or password.', null, 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password.', null, 401);
    }

    const token = generateToken(user._id);

    return successResponse(res, 'Login successful', {
      _id: user._id,
      name: user.name,
      email: user.email,
      preferredLanguage: user.preferredLanguage,
      token
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    return successResponse(res, 'User profile fetched successfully', user);
  } catch (error) {
    next(error);
  }
};
