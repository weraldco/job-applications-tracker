import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';

// Define acceptable document MIME types
const ALLOWED_MIME_TYPES = [
	'application/pdf', // PDF
	'application/msword', // DOC (Older Word format)
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX (Newer Word format)
];

// 1. Define the document file filter
const documentFileFilter = (
	req: Request,
	file: Express.Multer.File,
	cb: FileFilterCallback
) => {
	// Check if the file's MIME type is in the allowed list
	if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
		cb(null, true);
	} else {
		// 🚨 Reject with an explicit error
		cb(null, false);
	}
};

// 2. Configure Multer with Memory Storage
const uploadInMemory = multer({
	// This stores the file's binary data in RAM (Buffer), avoiding local disk saving
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 1024 * 1024 * 10, // Example: Limit file size to 10MB (Documents can be larger)
	},
	fileFilter: documentFileFilter,
});

export const uploadDocument = uploadInMemory; // Export the memory-based instance
