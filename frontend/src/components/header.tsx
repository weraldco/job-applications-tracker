/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { LogOut, User } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface HeaderT {
	user: string;
}

export function Header({ user }: HeaderT) {
	const router = useRouter();
	const handleSignOut = async () => {
		try {
			const signOut = await supabase.auth.signOut();

			if (signOut) {
				toast.success('Logout Success', {
					description: 'Successfully Logout, thank you!',
				});

				router.push('/');
			}
		} catch (error) {
			toast.error('Error Message', {
				description: 'Something went wront, cannot sign out..',
			});
		}
		localStorage.removeItem('supabase_token');
	};
	return (
		<header className="bg-white shadow-sm border-b border-neutral-100">
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					<div className="flex flex-col items-start justify-center space-x-4">
						<Image
							src="/images/logo.webp"
							width={300}
							height={200}
							className="w-40 md:w-50	"
							alt="jobstashr-logo"
						/>

						<span className="text-xs sm:text-sm hidden md:flex">
							Manage and track your job applications efficiently
						</span>
					</div>

					<div className="flex items-center space-x-4">
						<div className="flex items-center space-x-2">
							<User className="h-5 w-5 text-gray-500" />
							<span className="text-sm text-gray-700">{user}</span>
						</div>

						<Button
							variant="outline"
							size="sm"
							onClick={handleSignOut}
							className="flex items-center space-x-2 secondary-btn"
						>
							<LogOut className="h-4 w-4" />
							<span className="hidden md:flex">Sign out</span>
						</Button>
					</div>
				</div>
			</div>
		</header>
	);
}
