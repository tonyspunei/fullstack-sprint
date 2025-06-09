import { User } from '../models/user.model';
import { hashPassword } from '../utils/hash';
import { AppError } from '../utils/AppError';

export async function registerUser(email: string, password: string) {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError('User already exists', 'USER_TAKEN', 409);
  }

  const passwordHash = await hashPassword(password);
  const user = await User.create({ email, passwordHash });

  return user;
}
