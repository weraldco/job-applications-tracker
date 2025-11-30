import express from 'express';
import { jobController } from '../controlers/jobsController';
import { verifySupabaseToken } from '../middleware/auth/authMiddleware';

const router = express.Router();
router.use(verifySupabaseToken);
router.get('/', jobController.getAllJobs);
router.post('/create', jobController.createNewJob);
router.get('/:id', jobController.getSingleJob);
router.patch('/:id', jobController.updateJob);
router.delete('/:id', jobController.deleteJob);

export default router;
