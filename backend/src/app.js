import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';

import { env } from './config/env.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import pestRoutes from './routes/pestRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import soilRoutes from './routes/soilRoutes.js';
import schemeRoutes from './routes/schemeRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';
import smartKrishiRoutes from './routes/smartKrishiRoutes.js';
import mandiRoutes from './routes/mandiRoutes.js';

const app = express();

// Security Middlewares
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: env.clientUrl || '*',
    credentials: true
  })
);

// Logging Middleware
if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});
app.use('/api', limiter);

// Body Parsing Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploaded Static Files
app.use('/uploads', express.static(path.resolve('uploads')));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'KrishiSeva backend is running'
  });
});

// API Routes Setup
app.use('/api/auth', authRoutes);
app.use('/api/pest-detection', pestRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/soil', soilRoutes);
app.use('/api/government-schemes', schemeRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/smart-krishi', smartKrishiRoutes);
app.use('/api/mandi', mandiRoutes);

// Centralized Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
