import { createClient } from '@supabase/supabase-js';
import { NextFunction, Request, Response } from 'express';

interface CustomRequest extends Request {
	user?: { id: string };
}
const supabase = createClient(
	process.env.SUPABASE_URL!,
	process.env.SUPABASE_ANON_KEY!
);

export async function verifySupabaseToken(
	req: CustomRequest,
	res: Response,
	next: NextFunction
) {
	try {
		const token = req.headers.authorization?.split(' ')[1];

		if (!token) {
			return res.status(401).json({ message: 'No token' });
		}

		// Automatically verifies signature and expiration
		const { data, error } = await supabase.auth.getUser(token);

		if (error || !data.user) {
			return res.status(401).json({ message: 'Token invalid' });
		}

		req.user = { id: data.user.id }; // attach user id
		next();
	} catch (err) {
		return res.status(401).json({ message: 'Token invalid' });
	}
}
