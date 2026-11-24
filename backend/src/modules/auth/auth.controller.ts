import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service.js';
import { sendSuccess } from '../../common/utils/response.js';
import { AuthenticatedRequest } from '../../common/middleware/auth.middleware.js';
import { config } from '../../config/env.js';

const isProduction = config.nodeEnv === 'production';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax' as const,
  path: '/',
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, portal } = req.body;
    const result = await authService.login(email, password, portal);

    // Set refresh token cookie (7 days)
    res.cookie('refreshToken', result.tokens.refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Set access token cookie (15 mins)
    res.cookie('accessToken', result.tokens.accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 15 * 60 * 1000,
    });

    return sendSuccess(res, result, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh token is required' });
    }

    const tokens = await authService.refresh(refreshToken);

    res.cookie('refreshToken', tokens.refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('accessToken', tokens.accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 15 * 60 * 1000,
    });

    return sendSuccess(res, tokens, 'Tokens refreshed successfully');
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (req.user) {
      await authService.logout(req.user.userId, refreshToken);
    }

    res.clearCookie('refreshToken', COOKIE_OPTIONS);
    res.clearCookie('accessToken', COOKIE_OPTIONS);

    return sendSuccess(res, null, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

export const me = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const user = await authService.getCurrentUser(req.user.userId);
    return sendSuccess(res, user, 'Current user profile fetched');
  } catch (error) {
    next(error);
  }
};
