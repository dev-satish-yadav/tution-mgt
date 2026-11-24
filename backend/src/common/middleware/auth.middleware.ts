import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt.js';
import { AppError } from '../errors/app.error.js';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export const authenticate = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  // 1. Check Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    // 2. Check cookies
    token = req.cookies.accessToken;
  }

  if (!token) {
    return next(AppError.unauthorized('Authentication token is required'));
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return next(AppError.unauthorized('Access token expired. Please refresh your session.'));
    }
    return next(AppError.unauthorized('Invalid access token'));
  }
};

export const requireRole = (allowedRoles: ('ADMIN' | 'TEACHER' | 'STUDENT')[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(AppError.unauthorized('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(AppError.forbidden(`Access restricted to: ${allowedRoles.join(', ')}`));
    }

    next();
  };
};
