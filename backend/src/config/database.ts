import mongoose from 'mongoose';
import { config } from './env.js';

export const connectDatabase = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error('[Database] MongoDB connection error:', error);
    // Don't exit process in development to allow server to still provide clear feedback
  }
};
