import express, { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { aiController } from '../controlers/aiController';
import { verifySupabaseToken } from '../middleware/auth/authMiddleware';
import { uploadDocument } from '../middleware/upload'; // <-- Import the configured middleware

const router = express.Router();
router.use(verifySupabaseToken);

// Custom error handler for Multer
const multerErrorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err instanceof multer.MulterError) {
		return res.status(400).json({ error: `Upload error: ${err.message}` });
	}
	// Handle the custom error thrown in fileFilter
	if (
		err.message === 'Invalid file type. Only JPEG and PNG images are allowed.'
	) {
		return res.status(415).json({ error: err.message }); // 415 Unsupported Media Type
	}
	next(err); // Pass other errors to the default error handler
};

router.post(
	'/parse-file',
	uploadDocument.single('fileData'),
	aiController.parseFileData as express.RequestHandler,
	multerErrorHandler
);
router.post('/parse-text', uploadDocument.none(), aiController.parseTextData);

export default router;
