import express from 'express';
import {
	currentUser,
	refresh,
	signIn,
	signOut,
	signUp,
} from '../controlers/authController';

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/signout', signOut);
router.post('/refresh', refresh);
router.get('/current-user', currentUser);

export default router;
