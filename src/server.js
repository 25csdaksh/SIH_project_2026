import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { logger } from './utils/logger.js';

const startServer = async () => {
  // Start server listening immediately
  const server = app.listen(env.port, () => {
    logger.info(`KrishiSeva Server running in ${env.nodeEnv} mode on port ${env.port}`);
    logger.info(`Health check available at: http://localhost:${env.port}/api/health`);
  });

  // Connect to MongoDB Database in background
  connectDB().catch((err) => {
    logger.warn(`Background MongoDB connection attempt: ${err.message}`);
  });

  // Graceful Unhandled Rejection Handler
  process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled Promise Rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });

  // Graceful Uncaught Exception Handler
  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
  });
};

startServer();
