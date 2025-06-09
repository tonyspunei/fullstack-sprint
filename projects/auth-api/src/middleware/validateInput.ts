import { Request, Response, NextFunction } from 'express';

export const validateResiter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Missing fields' });
  if (password.length < 8)
    return res
      .status(400)
      .json({ message: 'Password must be at least 8 characters long' });

  next();
};
