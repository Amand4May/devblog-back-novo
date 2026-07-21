import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
}

// verifica se o usuario tem token valido antes de acessar a rota
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: 'Token não fornecido.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET || 'secret';
    
    const decoded = jwt.verify(token, secret);
    
    req.user = decoded;
    
    next();
  } catch (error) {
    // se o token foi adulterado ou o tempo de 24h passou
    res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};