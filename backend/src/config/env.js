import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/krishiseva',
  jwtSecret: process.env.JWT_SECRET || 'krishiseva_secure_jwt_secret_key_2026',
  
  weatherApiUrl: process.env.WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5',
  weatherApiKey: process.env.WEATHER_API_KEY || '',
  
  mandiApiUrl: process.env.MANDI_API_URL || 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070',
  mandiApiKey: process.env.MANDI_API_KEY || '',
  
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || ''
  },
  
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173'
};
