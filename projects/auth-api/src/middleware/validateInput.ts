import { Request, Response, NextFunction } from 'express';

export const validateResiter = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Missing fields' });
    return;
  }
  if (password.length < 8) {
    res
      .status(400)
      .json({ message: 'Password must be at least 8 characters long' });
    return;
  }

  next();
};
