import express from 'express';
import { testController } from '../controlers/testController';
import { verifySupabaseToken } from '../middleware/auth/authMiddleware';

const router = express.Router();

// router.use(verifySupabaseToken);
router.post('/', testController.testParser);

export default router;
