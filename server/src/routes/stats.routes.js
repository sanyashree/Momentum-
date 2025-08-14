import { Router } from 'express';
import * as stats from '../controllers/stats.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// all require auth
router.get("/weekly", requireAuth, stats.getWeeklyStats);
router.get("/weekly-by-habit", requireAuth, stats.getWeeklyByHabit);
router.get("/leaderboard", requireAuth, stats.getLeaderboard);

export default router;