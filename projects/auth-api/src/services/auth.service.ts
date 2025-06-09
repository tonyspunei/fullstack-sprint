import { User } from '../models/user.model';
import { hashPassword } from '../utils/hash';

export async function registerUser(email: string, password: string) {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error('User already exists');
  }

  const passwordHash = await hashPassword(password);
  const user = await User.create({ email, passwordHash });

  return user;
}
