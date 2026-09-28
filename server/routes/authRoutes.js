import { Router } from 'express';
import { changePassword, getMe, login } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimiters.js';
import validate from '../middleware/validate.js';
import { changePasswordRules, loginRules } from '../validators/authValidators.js';

// There is deliberately no public sign-up route: admins are created with `npm run create-admin`.
const router = Router();

router.post('/login', loginLimiter, validate(loginRules), login);
router.get('/me', protect, getMe);
router.put('/password', protect, validate(changePasswordRules), changePassword);

export default router;
