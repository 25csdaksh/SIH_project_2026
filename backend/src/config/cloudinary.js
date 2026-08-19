import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

if (env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret) {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret
  });
  logger.info('Cloudinary SDK configured.');
} else {
  logger.info('Cloudinary keys not set. Falling back to local file upload storage.');
}

export const uploadToCloudinary = async (filePath, folder = 'krishiseva/pests') => {
  if (!env.cloudinary.cloudName || !env.cloudinary.apiKey || !env.cloudinary.apiSecret) {
    return {
      secure_url: filePath,
      public_id: null
    };
  }

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto'
    });
    return result;
  } catch (error) {
    logger.error(`Cloudinary Upload Error: ${error.message}`);
    return {
      secure_url: filePath,
      public_id: null
    };
  }
};

export default cloudinary;
