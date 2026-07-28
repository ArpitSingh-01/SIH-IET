import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const authController = {
  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    if (email !== env.ADMIN_EMAIL || !(await bcrypt.compare(password, env.ADMIN_PASSWORD_HASH))) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ role: 'admin' }, env.JWT_SECRET, { expiresIn: '12h' });
    res.json({ token });
  },
};
