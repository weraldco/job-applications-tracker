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
import { queryClient } from '@/lib/react-query';
import { supabase } from '@/lib/supabase';
import { fetcher } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { Lock, Mail, User2 } from 'lucide-react';
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

	interface UserType {
		name: string;
		email: string;
		password: string;
	}
	const registerUser = useMutation({
		mutationFn: (newUser: Partial<UserType>) =>
			fetcher(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
				method: 'POST',
				body: JSON.stringify(newUser),
			}),
		onSuccess: () => {
			// redirect to '/' or index page
			toast.success('Successfully Signup', {
				description:
					"Welcome! You've successfully sign-up. You must very your account first to complete the registration.",
			});
			router.push('/');
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

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
			<Card className="w-full max-w-md">
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
							<Label htmlFor="name">Full name</Label>
							<div className="relative">
								<User2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
								<Input
									id="name"
									name="name"
									type="text"
									placeholder="Sarah Connor"
									required
									minLength={2}
									value={name}
									onChange={(event) => setName(event.target.value)}
									className="pl-10"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email address</Label>
							<div className="relative">
								<Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="you@example.com"
									required
									value={email}
									onChange={(event) => setEmail(event.target.value)}
									className="pl-10"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<div className="relative">
								<Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
								<Input
									id="password"
									name="password"
									type="password"
									placeholder="********"
									minLength={8}
									required
									value={password}
									onChange={(event) => setPassword(event.target.value)}
									className="pl-10"
								/>
							</div>
							<p className="text-xs text-gray-500">
								Use at least 8 characters. Include letters, numbers, or symbols
								for a stronger password.
							</p>
						</div>

						<Button type="submit" className="w-full" disabled={isSubmitting}>
							{isSubmitting ? 'Creating account...' : 'Create account'}
						</Button>
					</form>

					<p className="mt-6 text-center text-sm text-gray-600">
						Already have an account?{' '}
						<Link
							href="/auth/signin"
							className="font-medium text-blue-600 hover:underline"
						>
							Sign in
						</Link>
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
