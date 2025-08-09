import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { weeklyCompletion, weeklyByHabit, leaderboard } from '../controllers/stats.controller.js';

const router = Router();
router.use(requireAuth);

router.get('/weekly', weeklyCompletion);
router.get('/weekly-by-habit', weeklyByHabit);
router.get('/leaderboard', leaderboard);

export default router;


