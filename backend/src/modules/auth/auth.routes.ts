import { Router } from 'express';
import { login, refresh, logout, me } from './auth.controller.js';
import { validate } from '../../common/middleware/validate.middleware.js';
import { authenticate } from '../../common/middleware/auth.middleware.js';
import { loginSchema, refreshTokenSchema } from './auth.validation.js';

const router = Router();

router.post('/login', validate(loginSchema), login);
router.post('/refresh', validate(refreshTokenSchema), refresh);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, me);

export default router;
