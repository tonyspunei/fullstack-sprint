import { Request, Response } from 'express';
import { registerUser } from '../services/auth.service';

export const registerController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await registerUser(email, password);
    res.status(201).json({ message: 'User created', userId: user._id });
  } catch (error: any) {
    if (error.message === 'User already exists') {
      res.status(409).json({ message: 'User already exists' });
    }
    res.status(500).json({ message: 'Something went wrong' });
  }
};
