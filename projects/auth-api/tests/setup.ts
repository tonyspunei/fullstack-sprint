import mongoose from 'mongoose';
import { beforeAll, afterAll, beforeEach } from 'vitest';

beforeAll(async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined');
  }
  try {
    console.log('🔌 Connecting to test database...');
    await mongoose.connect(process.env.MONGO_URI as string, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Database connected');
  } catch(error) {
    console.error('❌ Error connecting to MongoDB:', error);
    process.exit(1);
  }
});

beforeEach(async () => {
  // Only drop users collection if database is connected
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.db?.dropCollection('users');
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});
