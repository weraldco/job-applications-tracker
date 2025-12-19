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
import SiteLogo from '@/components/site-logo';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { Eye, EyeClosed, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
export default function SignInPage() {
	const { user, loading } = useAuthGuard({
		redirectIfAuthenticated: true,
		redirectPath: '/dashboard',
	});
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	// Show passwor
	const [isShowPassword, setIsShowPassword] = useState(false);

	const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		setIsLoading(true);

		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (!data.user?.email_confirmed_at) {
				toast.error('ERROR', {
					description: `Email need to verify first. here https://jobstashr.vercel.app/auth/verify-email?email=${email}`,
				});

				setTimeout(() => {
					router.push(`/auth/verify-email?email=${email}`);
				}, 2000);
			}
			if (error) {
				toast.error('ERROR MESSAGE', { description: error.message });
				return;
			}

			toast.success('SUCCESS', {
				description: 'Successfully Login, welcome back!',
			});

			// Save a date when you successfully logged in.
			if (data.session) {
				localStorage.setItem('loginAt', Date.now().toString());
			}

			router.push('/dashboard');
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
		<div className="min-h-screen flex items-center justify-center p-4 flex-col gap-4 bg-orange-50/70 relative">
			<div className="flex items-center justify-center">
				<SiteLogo className="w-60 md:w-80 h-20 " />
			</div>
			<Card className="w-full max-w-md bg-white border-0 rounded-2xl">
				<CardHeader className="text-center space-y-2">
					<CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
					<CardDescription>
						Sign in with the email address you used to register.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleLogin} className="space-y-4">
						<div className="space-y-2 ">
							<Label htmlFor="email" className="text-neutral-400 text-xs">
								Your Email
							</Label>
							<div className="relative">
								<Mail className="absolute left-4 top-4 h-4 w-4 text-gray-400" />
								<Input
									id="email"
									type="email"
									required
									autoComplete="email"
									className=" rounded-full pl-10 pt-6 pb-6 text-sm outline-0 border-[#e7e7e7] bg-[#fafbfd] "
									placeholder="Enter your email address.."
									value={email}
									onChange={(event) => setEmail(event.target.value)}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password" className="text-neutral-400 text-xs">
								Password
							</Label>
							<div className="relative">
								<Lock className="absolute left-4 top-4 h-4 w-4 text-gray-400" />
								<Input
									id="password"
									type={isShowPassword ? 'text' : 'password'}
									required
									autoComplete="current-password"
									className="pl-10 pt-6 pb-6 outline-0 border-[#e7e7e7] bg-[#fafbfd] rounded-full text-sm"
									placeholder="Enter your password.."
									value={password}
									onChange={(event) => setPassword(event.target.value)}
								/>
								<button
									type="button"
									onClick={() => setIsShowPassword((curr) => !curr)}
								>
									{isShowPassword ? (
										<EyeClosed className="absolute right-4 top-4 h-5 w-6 text-gray-400 hover:text-gray-500" />
									) : (
										<Eye className="absolute right-4 top-4 h-5 w-6 text-gray-400 hover:text-gray-500" />
									)}
								</button>
							</div>
						</div>

						<Button
							type="submit"
							className="w-full  bg-[#ef831e] hover:bg-[#f69234] active:bg-[#d1721a] duration-200 text-white border-0 outline-0 py-7 text-sm rounded-full"
							disabled={isLoading}
						>
							{isLoading ? 'Signing in...' : 'Sign in'}
						</Button>
					</form>

					<p className="mt-6 text-center text-sm text-gray-400">
						Don&apos;t have an account?{' '}
						<Link
							href="/auth/signup"
							className="font-medium text-[#ef831e]/90 hover:underline"
						>
							Sign up
						</Link>
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
