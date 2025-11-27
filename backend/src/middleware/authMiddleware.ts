import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface CustomRequest extends Request {
	user?: { id: string };
}

export const protect = (
	req: CustomRequest,
	res: Response,
	next: NextFunction
) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'Not authorized, no token' });
	}

	const token = authHeader.split(' ')[1];
	if (!token) return res.status(401).json({ message: 'Invalid token' });

	const JWT_SECRET = process.env.JWT_SECRET;
	if (!JWT_SECRET)
		return res.status(500).json({ message: 'JWT_SECRET not set' });

	try {
		const decoded = jwt.verify(token, JWT_SECRET);

		if (typeof decoded !== 'object' || decoded === null || !('id' in decoded)) {
			throw new Error('Invalid token payload');
		}

		req.user = { id: (decoded as JwtPayload & { id: string }).id };
		next();
	} catch (error) {
		console.error('JWT verification error:', error);
		return res.status(401).json({ message: 'Not authorized, token failed' });
	}
};
