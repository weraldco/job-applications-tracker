import { Request, Response } from 'express';
import { prisma } from '../lib/db';

export const getUsers = async (req: Request, res: Response) => {
	const data = await prisma.user.findMany();
	return res.json({ data });
};

export const postUsers = (req: Request, res: Response) => {};
