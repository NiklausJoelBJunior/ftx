import { Router } from 'express';
import { login, profile, register, updateProfile } from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth(), profile);
router.put('/profile', auth(), updateProfile);
export default router;
