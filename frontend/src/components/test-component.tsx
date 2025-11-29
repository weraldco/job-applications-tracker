'use client';
import { supabase } from '../lib/supabase';

export default function PdfUploader() {
	const handleLogin = async () => {
		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email: 'werald.opolento@gmail.com',
				password: 'password123',
			});
			const session = await supabase.auth.getSession();
			const token = session.data.session?.access_token;

			const res = await fetch('http://localhost:4000/api/jobs', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`, // <-- IMPORTANT
				},
			});

			if (error) {
				console.log('ERROR', error);
			}
			console.log('DATA', data);
			const response = await res.json();
			console.log('RES', response);
		} catch (error) {
			console.error('Something went wrong!');
		}
	};

	const handleSignUp = async () => {
		try {
			const { data, error } = await supabase.auth.signUp({
				email: 'werald.opolento@gmail.com',
				password: 'password123',
			});

			if (error) {
				console.log('Error', error);
			}
			console.log('Data', data);
		} catch (error) {
			console.log('Error signup');
		}
	};
	return (
		<div className="flex flex-col gap-4 w-full max-w-md">
			<button onClick={handleLogin}>Login</button>
			<button onClick={handleSignUp}>Sign up</button>
		</div>
	);
}
