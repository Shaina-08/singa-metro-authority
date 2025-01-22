import mongoose from 'mongoose';
import logger from './logger';
import { MONGODB_URI } from './index';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info('MongoDB connected successfully', MONGODB_URI);
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

