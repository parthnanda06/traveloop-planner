import { Router } from 'express';
import {
  register, login, getMe, updateProfile, deleteAccount
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, upload.single('avatar'), updateProfile);
router.delete('/account', authenticate, deleteAccount);

export default router;
