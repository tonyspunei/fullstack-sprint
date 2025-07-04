import express from 'express';
import authRoutes from './routes/auth.route';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { requestLogger } from './middleware/requestLogger';

dotenv.config();

export const createServer = () => {
  const app = express();

  app.use(express.json());
  app.use(requestLogger);
  app.use('/api/auth', authRoutes);

  mongoose.connect(process.env.MONGO_URI as string);

  return app;
};
