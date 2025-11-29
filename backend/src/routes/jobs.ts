import express from 'express';
import { verifySupabaseToken } from '../middleware/auth/authMiddleware';

const router = express.Router();

router.get('/jobs', verifySupabaseToken, async (req, res) => {
	return res.json({
		message: 'User authenticated!',
		userId: req.user.id,
	});
});

export default router;
