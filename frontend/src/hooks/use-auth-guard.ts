/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface AuthGuardOptions {
	redirectIfAuthenticated?: boolean; // for auth pages
	redirectIfNotAuthenticated?: boolean; // for protected pages
	redirectPath?: string; // where to redirect
}
const MAX_SESSION_MS = 8 * 60 * 60 * 1000; // 1 hours

export function useAuthGuard({
	redirectIfAuthenticated = false,
	redirectIfNotAuthenticated = false,
	redirectPath = '/',
}: AuthGuardOptions = {}) {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<any>(null);

	useEffect(() => {
		const checkAuth = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			// Check the expiration first
			const lastLogged = localStorage.getItem('loginAt');

			const expired = Date.now() - Number(lastLogged) > MAX_SESSION_MS;

			if (expired) {
				await supabase.auth.signOut();
				localStorage.removeItem('loginAt');
				setUser(null);
				setLoading(false);
				router.replace('/auth/signin');
				return;
			}

			const sessionExists = !!session;

			if (redirectIfNotAuthenticated && !sessionExists) {
				setLoading(false);
				router.replace(redirectPath); // redirect to signin
				return;
			}

			if (redirectIfAuthenticated && sessionExists) {
				setLoading(false);
				router.replace(redirectPath); // redirect to dashboard
				return;
			}

			setUser(session?.user ?? null);
			setLoading(false);
		};
		checkAuth();
	}, [
		router,
		redirectIfAuthenticated,
		redirectIfNotAuthenticated,
		redirectPath,
	]);

	return { user, loading };
}
