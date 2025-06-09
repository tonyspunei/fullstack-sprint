import { Request, Response } from 'express';
import { loginUser, registerUser } from '../services/auth.service';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

export const registerController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await registerUser(email, password, req.requestId);
    res.status(201).json({ 
      success: true,
      message: 'User created', 
      userId: user._id 
    });
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ 
        success: false,
        message: error.message,
        code: error.code,
        errorId: error.errorId
      });
    } else {
      logger.error('Unhandled registration error', { 
        requestId: req.requestId,
        email: req.body?.email 
      }, { 
        error: error?.message || 'Unknown error' 
      });
      res.status(500).json({ 
        success: false,
        message: 'Something went wrong',
        code: 'INTERNAL_ERROR'
      });
    }
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password, req.requestId);
    res.status(200).json({ 
      success: true,
      message: 'User logged in', 
      userId: user._id, 
      token: user.token, 
      expiresIn: user.expiresIn 
    });
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ 
        success: false,
        message: error.message,
        code: error.code,
        errorId: error.errorId
      });
    } else {
      logger.error('Unhandled login error', { 
        requestId: req.requestId,
        email: req.body?.email 
      }, { 
        error: error?.message || 'Unknown error' 
      });
      res.status(500).json({ 
        success: false,
        message: 'Something went wrong',
        code: 'INTERNAL_ERROR'
      });
    }
  }
};