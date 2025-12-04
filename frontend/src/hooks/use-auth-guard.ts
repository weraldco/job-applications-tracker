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
			const { data } = await supabase.auth.getSession();
			const sessionExists = !!data.session;

			if (redirectIfNotAuthenticated && !sessionExists) {
				router.replace(redirectPath); // redirect to signin
				return;
			}

			if (redirectIfAuthenticated && sessionExists) {
				router.replace(redirectPath); // redirect to dashboard
				return;
			}

			setUser(data.session?.user ?? null);
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
