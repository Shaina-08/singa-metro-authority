import dotenv from 'dotenv';

dotenv.config();

export const {
  NODE_ENV = 'development',
  PORT = 3000,
  MONGODB_URI= 'mongodb://localhost:27017/ecommerce',
  JWT_SECRET,
} = process.env;

if (!MONGODB_URI || !JWT_SECRET) {
  throw new Error('Environment variables MONGODB_URI and JWT_SECRET must be defined.');
}

