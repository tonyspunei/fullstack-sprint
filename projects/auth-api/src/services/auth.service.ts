import { User } from '../models/user.model';
import { comparePassword, hashPassword } from '../utils/hash';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

export async function registerUser(email: string, password: string, requestId?: string) {
  const context = { requestId, email };

  logger.info('Registration attempt initiated', context);

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    logger.warn('Registration failed: account exists', context);
    throw new AppError('User already exists', 'USER_TAKEN', 409);
  }

  try {
    const passwordHash = await hashPassword(password);
    const user = await User.create({ email, passwordHash });

    logger.info('User registration successful', { 
      requestId, 
      email, 
      userId: user._id.toString() 
    });

    return user;
  } catch (error) {
    logger.error('Registration database operation failed', context, { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    throw error;
  }
}

export async function loginUser(email: string, password: string, requestId?: string) {
  const context = { requestId, email };

  logger.info('Login attempt initiated', context);

  const user = await User.findOne({ email });

  if (!user) {
    logger.warn('Login failed: account not found', context);
    throw new AppError('User not found', 'USER_NOT_FOUND', 404);
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);

  if (!isPasswordValid) {
    logger.warn('Login failed: invalid credentials', { 
      requestId, 
      email, 
      userId: user._id.toString() 
    });
    throw new AppError('Invalid credentials', 'INVALID_CREDENTIALS', 401);
  }

  if (!user.verified) {
    logger.warn('Login failed: account not verified', { 
      requestId, 
      email, 
      userId: user._id.toString() 
    });
    throw new AppError('User not verified', 'USER_NOT_VERIFIED', 401);
  }

  try {
    user.lastLogin = new Date();
    await user.save();

    logger.info('Login successful', { 
      requestId, 
      email, 
      userId: user._id.toString() 
    });

    return user;
  } catch (error) {
    logger.error('Login database update failed', { 
      requestId, 
      email, 
      userId: user._id.toString() 
    }, { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    throw error;
  }
}