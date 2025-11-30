// routes/aiRoutes.ts

import express, { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { aiController } from '../controlers/aiController';
import { uploadDocument } from '../middleware/upload'; // <-- Import the configured middleware

const router = express.Router();

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
	'/parse',
	uploadDocument.single('imageFile'),
	// FIX: Explicitly cast the controller method to the RequestHandler type.
	// This tells Express to treat it as a standard middleware/handler
	aiController.parseData as express.RequestHandler,
	multerErrorHandler
);

export default router;
