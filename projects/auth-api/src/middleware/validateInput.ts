import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    logger.warn('Registration validation failed: missing fields', { 
      requestId: req.requestId, 
      email: email || 'not_provided' 
    });
    res.status(400).json({ 
      success: false,
      message: 'Missing fields',
      code: 'MISSING_FIELDS'
    });
    return;
  }
  
  if (password.length < 8) {
    logger.warn('Registration validation failed: password too short', { 
      requestId: req.requestId, 
      email 
    });
    res.status(400).json({ 
      success: false,
      message: 'Password must be at least 8 characters long',
      code: 'PASSWORD_TOO_SHORT'
    });
    return;
  }
  
  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    logger.warn('Login validation failed: missing fields', { 
      requestId: req.requestId, 
      email: email || 'not_provided' 
    });
    res.status(400).json({ 
      success: false,
      message: 'Missing fields',
      code: 'MISSING_FIELDS'
    });
    return;
  }
  
  next();
};