import { Router } from 'express';
import { generateTrip, saveAiTrip } from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/generate', authenticate, generateTrip);
router.post('/save', authenticate, saveAiTrip);

export default router;
