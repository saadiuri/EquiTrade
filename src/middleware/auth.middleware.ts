import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: 'Token não fornecido',
      });
      return;
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
      res.status(401).json({
        success: false,
        message: 'Formato de token inválido',
      });
      return;
    }

    const [scheme, token] = parts;

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Token não fornecido',
      });
      return;
    }

    //testa se o token é válido
    if (!scheme || !/^Bearer$/i.test(scheme)) {
      res.status(401).json({
        success: false,
        message: 'Token mal formatado',
      });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const decoded = jwt.verify(token, jwtSecret) as any;
    
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      tipo: decoded.tipo,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token inválido ou expirado',
    });
  }
};

export const requireVendedor = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Autenticação necessária',
    });
    return;
  }

  if (req.user.tipo !== 'Vendedor') {
    res.status(403).json({
      success: false,
      message: 'Acesso restrito a vendedores',
    });
    return;
  }

  next();
};

export const requireComprador = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Autenticação necessária',
    });
    return;
  }

  if (req.user.tipo !== 'Comprador') {
    res.status(403).json({
      success: false,
      message: 'Acesso restrito a compradores',
    });
    return;
  }

  next();
};
