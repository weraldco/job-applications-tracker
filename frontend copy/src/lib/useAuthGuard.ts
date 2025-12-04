/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useAuthGuard() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<any>(null);

	useEffect(() => {
		const checkAuth = async () => {
			const { data } = await supabase.auth.getSession();

			if (!data.session) {
				router.push('/auth/signin');
				return;
			}

			setUser(data.session.user);
			setLoading(false);
		};

		checkAuth();
	}, [router]);

	return { user, loading };
}
