import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tuition_mgt',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'fallback_access_secret_123',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret_123',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  adminSeed: {
    name: process.env.INITIAL_ADMIN_NAME || 'Super Admin',
    email: process.env.INITIAL_ADMIN_EMAIL || 'admin@tuitionmgt.com',
    password: process.env.INITIAL_ADMIN_PASSWORD || 'Admin@123456',
    phone: process.env.INITIAL_ADMIN_PHONE || '9876543210',
  },
};
