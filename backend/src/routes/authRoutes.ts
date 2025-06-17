import { Router } from 'express';
import { login, getProfile } from '../controllers/authController';
import { validate, loginSchema } from '../middleware/validation';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/login', validate(loginSchema), login);
router.get('/profile', authenticate, getProfile);

export default router;