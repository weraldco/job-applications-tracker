// controllers/aiController.ts

import { Request, Response } from 'express';
import { summarizeJob } from '../lib/helper';
import { aiServices } from '../services/aiServices';
// Assuming the interface is defined here or imported
interface MulterRequest extends Request {
	file?: Express.Multer.File;
}

export const aiController = {
	async parseData(req: MulterRequest, res: Response) {
		if (!req.file) {
			return res.status(400).json({ error: 'No file data received.' });
		}

		// 🚨 Access the binary data buffer
		const fileBuffer: Buffer = req.file.buffer;
		const mimeType: string = req.file.mimetype;
		let extractedContent: string = '';

		if (mimeType == 'application/pdf') {
			extractedContent = await aiServices.parsePdf(fileBuffer);
		} else if (
			mimeType.includes('wordprocessingml') ||
			mimeType === 'application/msword'
		) {
			extractedContent = await aiServices.parseDocx(fileBuffer);
		} else {
			return res
				.status(415)
				.json({ error: 'Unsupported file type after upload.' });
		}
		console.log(extractedContent);
		const result = await summarizeJob(extractedContent);

		return res.status(200).json(result);
	},
	async testData(req: MulterRequest, res: Response) {
		return res.status(200).json('Hello');
	},
};
