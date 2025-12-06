/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '../../../lib/supabase';

import LoadingState from '@/components/loading-state';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
export default function SignInPage() {
	const { user, loading } = useAuthGuard({
		redirectIfAuthenticated: true,
		redirectPath: '/',
	});
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		setIsLoading(true);

		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				toast.error('ERROR MESSAGE', { description: error.message });
				return;
			}

			toast.success('SUCCESS', {
				description: 'Successfully Login, welcome back!',
			});

			router.push('/');
			router.refresh();
		} catch (error) {
			toast.error('Sign in failed', {
				description: 'Unexpected error while signing in',
			});
		} finally {
			setIsLoading(false);
		}
	};
	if (loading) return <LoadingState />;
	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center space-y-2">
					<CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
					<CardDescription>
						Sign in with the email address you used to register.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<div className="relative">
								<Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
								<Input
									id="email"
									type="email"
									required
									autoComplete="email"
									className="pl-10"
									value={email}
									onChange={(event) => setEmail(event.target.value)}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<div className="relative">
								<Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
								<Input
									id="password"
									type="password"
									required
									autoComplete="current-password"
									className="pl-10"
									value={password}
									onChange={(event) => setPassword(event.target.value)}
								/>
							</div>
						</div>

						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? 'Signing in...' : 'Sign in'}
						</Button>
					</form>

					<p className="mt-6 text-center text-sm text-gray-600">
						Don&apos;t have an account?{' '}
						<Link
							href="/auth/signup"
							className="font-medium text-blue-600 hover:underline"
						>
							Sign up
						</Link>
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
