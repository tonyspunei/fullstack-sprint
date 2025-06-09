import express from 'express';
import authRoutes from './routes/auth.route';

export const createServer = () => {
  const app = express();

  app.use(express.json());
  app.use('/api/auth', authRoutes);

  return app;
};
