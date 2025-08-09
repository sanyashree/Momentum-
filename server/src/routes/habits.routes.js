import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { listHabits, createHabit, updateHabit, deleteHabit, toggleHabit } from '../controllers/habits.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', listHabits);
router.post('/', createHabit);
router.patch('/:id', updateHabit);
router.delete('/:id', deleteHabit);
router.post('/:id/toggle', toggleHabit);

export default router;


