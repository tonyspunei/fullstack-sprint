import { Request, Response } from 'express';
import { registerUser } from '../services/auth.service';
import { AppError } from '../utils/AppError';

export const registerController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await registerUser(email, password);
    res.status(201).json({ message: 'User created', userId: user._id });
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: 'Something went wrong' });
  }
};
