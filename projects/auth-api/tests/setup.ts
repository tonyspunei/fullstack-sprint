import { beforeAll, afterAll, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { User } from '../src/models/user.model';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
});

beforeEach(async () => {
  await mongoose.connection.db?.dropCollection('users');
});

afterAll(async () => {
  await mongoose.connection.close();
});
