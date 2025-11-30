import express from 'express';
import { reminderController } from '../controlers/reminderController';
import { verifySupabaseToken } from '../middleware/auth/authMiddleware';

const router = express.Router();

router.use(verifySupabaseToken);
router.get('/', reminderController.getAllReminders);
router.post('/create', reminderController.createReminder);
router.get('/:id', reminderController.getReminder);
router.patch('/:id', reminderController.updateReminder);
router.delete('/:id', reminderController.deleteReminder);

export default router;
