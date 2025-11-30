import { Request, Response } from 'express';
import { testServices } from '../services/testServices';

export const testController = {
	async testParser(req: Request, res: Response) {
		const { url } = req.body;
		const result = await testServices.parsePdfFromPath(url);
		return res.status(200).json(result);
	},
};
