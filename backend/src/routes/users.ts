import { Router } from 'express';
import { getUsers } from '../controlers/userController';

const router = Router();

router.get('/', getUsers);

export default router;
