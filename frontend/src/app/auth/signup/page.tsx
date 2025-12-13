/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import LoadingState from '@/components/loading-state';
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
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { useMutation } from '@tanstack/react-query';
import { Lock, Mail, User2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function SignUpPage() {
	const router = useRouter();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { user, loading } = useAuthGuard({
		redirectIfAuthenticated: true,
		redirectPath: '/home',
	});
	interface UserType {
		name: string;
		email: string;
		password: string;
	}
	const registerUser = useMutation({
		mutationFn: (newUser: Partial<UserType>) =>
			fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newUser),
			}),
		onSuccess: () => {
			// redirect to '/' or index page
			toast.success('Successfully Signup', {
				description:
					"Welcome! You've successfully sign-up. You must verify your account first to complete the registration.",
			});
			router.push(`/auth/verify-email?email=${email}`);
			router.refresh();
		},
		onError: () => {
			toast.error('Error:', { description: 'Registration failed!' });
		},
		onSettled: () => {
			setIsSubmitting(false);
		},
	});

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const newUser = {
			name,
			email,
			password,
		};

		registerUser.mutate(newUser);
		setIsSubmitting(true);
	};
	if (loading) return <LoadingState />;
	return (
		<div className="min-h-screen flex items-center justify-center p-4 flex-col gap-4 bg-orange-50/70">
			<div className="flex items-center justify-center">
				<Link href="/" className="">
					<Image
						src="/images/logo.webp"
						width={300}
						height={300}
						alt="jobstashr-logo"
						className="w-60 md:w-80"
					/>
				</Link>
			</div>
			<Card className="w-full max-w-md bg-white border-0 rounded-2xl">
				<CardHeader className="space-y-2 text-center">
					<CardTitle className="text-2xl font-bold">
						Create your account
					</CardTitle>
					<CardDescription>
						Sign up to start tracking your job applications.
					</CardDescription>
				</CardHeader>

				<CardContent>
					<form className="space-y-4" onSubmit={handleSubmit}>
						<div className="space-y-2">
							<Label htmlFor="name" className="text-neutral-400 text-xs">
								Full name
							</Label>
							<div className="relative">
								<User2 className="absolute right-4 top-4 h-4 w-4 text-gray-400" />
								<Input
									id="name"
									name="name"
									type="text"
									placeholder="Sarah Connor"
									required
									minLength={2}
									value={name}
									onChange={(event) => setName(event.target.value)}
									className=" rounded-full pl-4 pt-6 pb-6 text-sm outline-0 border-[#e7e7e7] bg-[#fafbfd] "
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email" className="text-neutral-400 text-xs">
								Email address
							</Label>
							<div className="relative">
								<Mail className="absolute right-4 top-4 h-4 w-4 text-gray-400" />
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="you@example.com"
									required
									value={email}
									onChange={(event) => setEmail(event.target.value)}
									className=" rounded-full pl-4 pt-6 pb-6 text-sm outline-0 border-[#e7e7e7] bg-[#fafbfd] "
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password" className="text-neutral-400 text-xs">
								Password
							</Label>
							<div className="relative">
								<Lock className="absolute right-4 top-4 h-4 w-4 text-gray-400" />
								<Input
									id="password"
									name="password"
									type="password"
									placeholder="********"
									minLength={8}
									required
									value={password}
									onChange={(event) => setPassword(event.target.value)}
									className=" rounded-full pl-4 pt-6 pb-6 text-sm outline-0 border-[#e7e7e7] bg-[#fafbfd] "
								/>
							</div>
							<p className="text-xs text-gray-400">
								Use at least 8 characters. Include letters, numbers, or symbols
								for a stronger password.
							</p>
						</div>

						<Button
							type="submit"
							className="w-full bg-[#ef831e] hover:bg-[#f69234] active:bg-[#d1721a] duration-200 text-white border-0 outline-0 py-7 text-sm rounded-full"
							disabled={isSubmitting}
						>
							{isSubmitting ? 'Creating account...' : 'Create account'}
						</Button>
					</form>

					<p className="mt-6 text-center text-sm text-gray-400">
						Already have an account?{' '}
						<Link
							href="/auth/signin"
							className="font-medium text-[#ef831e] hover:underline"
						>
							Sign in
						</Link>
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
