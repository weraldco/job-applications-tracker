import { createClient } from '@supabase/supabase-js';
import { Request, Response } from 'express';
import { prisma } from '../lib/db';

const supabase = createClient(
	process.env.SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface SupabaseTokenResponse {
	access_token: string;
	refresh_token: string;
	user: {
		id: string;
		email: string;
		[key: string]: any;
	};
	error?: string;
	error_description?: string;
}

interface SupabaseUserResponse {
	id: string;
	email: string;
	[key: string]: any;
	error?: string;
	error_description?: string;
}

export const signUp = async (req: Request, res: Response) => {
	const { email, password, name } = req.body;
	if (!email || !password || !name)
		return res.status(400).json({ error: 'Missing fields' });

	try {
		// 1️⃣ Create user in Supabase Auth
		const { data: supabaseUser, error } = await supabase.auth.admin.createUser({
			email,
			password,
			user_metadata: { displayName: name },
		});

		if (error) return res.status(400).json({ error: error.message });

		// 2️⃣ Create Prisma user row
		const prismaUser = await prisma.user.create({
			data: {
				id: supabaseUser.user.id,
				email: supabaseUser.user.email!,
				name,
			},
		});

		return res.status(201).json({ user: prismaUser });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: 'Internal server error' });
	}
};

export const signIn = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	if (!email || !password)
		return res.status(400).json({ error: 'Missing email or password' });

	try {
		const response = await fetch(
			`${process.env.SUPABASE_URL}/auth/v1/token?grant_type=password`,
			{
				method: 'POST',
				headers: {
					apikey: process.env.SUPABASE_ANON_KEY!,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			}
		);

		const data = (await response.json()) as SupabaseTokenResponse;
		if (data.error)
			return res.status(401).json({ error: data.error_description });

		// Set HTTP-only cookies
		res.cookie('access_token', data.access_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
		});
		res.cookie('refresh_token', data.refresh_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
		});

		const id = data.user.id;
		console.log('ID', id);
		// Fetch Prisma user
		const prismaUser = await prisma.user.findUnique({
			where: { id: data.user.id },
		});
		return res.json({ prismaUser });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: 'Internal server error' });
	}
};

export const signOut = async (req: Request, res: Response) => {
	try {
		// Clear cookies
		res.clearCookie('access_token', {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
		});

		res.clearCookie('refresh_token', {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
		});

		return res.json({ message: 'Logged out successfully' });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: 'Internal server error' });
	}
};

export const refresh = async (req: Request, res: Response) => {
	try {
		const refreshToken = req.cookies.refresh_token;
		// 1. No refresh token → user not logged in
		if (!refreshToken)
			return res.status(401).json({ error: 'Not authenticated!' });

		// 2. Try refreshing session
		const { data, error } = await supabase.auth.refreshSession({
			refresh_token: refreshToken,
		});
		if (error) {
			console.error('ERROR:', error);
			return res
				.status(401)
				.json({ error: `${error.message}, Invalid or expired token` });
		}

		const user = data.user;
		// 3. No user returned
		if (!user || !user.id) {
			return res.status(401).json({ error: 'Invalid session' });
		}

		res.cookie('access_token', data.session?.access_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
		});

		res.cookie('refresh_token', data.session?.refresh_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
		});

		// 4. Fetch from Prisma
		console.log('DATA', data);
		const userId = data.session?.user.id;

		if (!userId) {
			return res.status(400).json({ error: 'Invalid data user id' });
		}

		const prismaUser = await prisma.user.findUnique({
			where: { id: userId },
		});
		if (!prismaUser) {
			return res.status(404).json({ error: 'User not found in database' });
		}
		console.log(prismaUser);
		return res.json({ user: prismaUser });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: 'Internal server error' });
	}
};

export const currentUser = async (req: Request, res: Response) => {
	try {
		const accessToken = req.cookies.access_token;
		if (!accessToken)
			return res.status(401).json({ error: 'Not authenticated' });

		const { data, error } = await supabase.auth.getUser(accessToken);

		if (error || !data?.user) {
			return res.status(401).json({ error: 'Invalid access token' });
		}

		const user = data.user;

		const prismaUser = await prisma.user.findUnique({
			where: { id: user.id },
		});

		if (!prismaUser) {
			return res.status(404).json({ error: "User didn't exist!" });
		}
		return res.json({ user: prismaUser });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: 'Internal server error' });
	}
};
