import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import StreakService from '../services/streakService.js';
import SchedulerService from '../services/schedulerService.js';

const router = Router();

// Initialize scheduler service
const schedulerService = new SchedulerService();

// Start the scheduler when routes are loaded
schedulerService.start();

// GET /api/streaks/validate - Validate and fix user streaks
router.get('/validate', requireAuth, async (req, res, next) => {
  try {
    const inconsistencies = await StreakService.validateStreaks(req.userId);
    const updates = await StreakService.updateUserStreaks(req.userId);
    
    res.json({
      message: 'Streak validation completed',
      inconsistencies: inconsistencies.length,
      updates: updates.length,
      details: updates
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/streaks/stats - Get user streak statistics
router.get('/stats', requireAuth, async (req, res, next) => {
  try {
    const stats = await StreakService.getUserStreakStats(req.userId);
    res.json({ stats });
  } catch (err) {
    next(err);
  }
});

// POST /api/streaks/refresh - Manually refresh user streaks
router.post('/refresh', requireAuth, async (req, res, next) => {
  try {
    const updates = await StreakService.updateUserStreaks(req.userId);
    res.json({
      message: 'Streaks refreshed successfully',
      updates: updates.length,
      details: updates
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/streaks/scheduler/status - Get scheduler status (admin only)
router.get('/scheduler/status', requireAuth, async (req, res, next) => {
  try {
    const status = schedulerService.getStatus();
    res.json({ status });
  } catch (err) {
    next(err);
  }
});

// POST /api/streaks/scheduler/start - Start scheduler (admin only)
router.post('/scheduler/start', requireAuth, async (req, res, next) => {
  try {
    schedulerService.start();
    res.json({ message: 'Scheduler started successfully' });
  } catch (err) {
    next(err);
  }
});

// POST /api/streaks/scheduler/stop - Stop scheduler (admin only)
router.post('/scheduler/stop', requireAuth, async (req, res, next) => {
  try {
    schedulerService.stop();
    res.json({ message: 'Scheduler stopped successfully' });
  } catch (err) {
    next(err);
  }
});

// POST /api/streaks/scheduler/validate-all - Manually trigger validation for all users (admin only)
router.post('/scheduler/validate-all', requireAuth, async (req, res, next) => {
  try {
    await schedulerService.performInitialStreakValidation();
    res.json({ message: 'Full system validation completed' });
  } catch (err) {
    next(err);
  }
});

// POST /api/streaks/scheduler/catch-up - Force catch-up maintenance for missed windows
router.post('/scheduler/catch-up', requireAuth, async (req, res, next) => {
  try {
    const result = await schedulerService.forceCatchUp();
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
