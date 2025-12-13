'use client';

import { supabase } from '@/lib/supabase';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const useCheckVerified = (
	redirectIfVerified: string = '/home',
	redirectIfLoggedOut: string = '/auth/signin'
) => {
	const searchParams = useSearchParams();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const check = async () => {
			const { data } = await supabase.auth.getUser();
			const user = data.user;

			// Allow visiting the page if email query param exists
			const emailParam = searchParams.get('email');

			// 1️⃣ Not logged in & NO email param → redirect
			if (!user && !emailParam) {
				window.location.href = redirectIfLoggedOut;
				return;
			}

			// 2️⃣ Logged in + verified → redirect
			if (user?.email_confirmed_at) {
				window.location.href = redirectIfVerified;
				return;
			}

			// 3️⃣ Logged in + NOT verified OR email param exists → allow page
			setLoading(false);
		};

		check();
	}, [redirectIfLoggedOut, redirectIfVerified, searchParams]);

	return { loading };
};

export default useCheckVerified;
