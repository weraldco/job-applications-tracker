'use client';

import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { LogOut, User } from 'lucide-react';
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

				router.push('/auth/signin');
			}
		} catch (error) {
			toast.error('Error Message', {
				description: 'Something went wront, cannot sign out..',
			});
		}
		localStorage.removeItem('supabase_token');
	};
	return (
		<header className="bg-white shadow-sm border-b">
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					<div className="flex flex-col items-start justify-center space-x-4">
						<h1 className="text-[1.3em] sm:text-2xl font-semibold text-gray-900">
							Job Application Tracker
						</h1>
						<span className="text-xs sm:text-sm">
							Manage and track your job applications efficiently
						</span>
					</div>

					<div className="flex items-center space-x-4">
						<div className="flex items-center space-x-2">
							<User className="h-5 w-5 text-gray-500" />
							<span className="text-sm text-gray-700">{user}</span>
						</div>
						{/* <Button className="relative hover:bg-neutral-200 rounded-full h-10 w-10 p-0">
							<Bell size={20} />
							<span className="absolute -left-1 -top-1 bg-red-400 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm">
								10
							</span>
						</Button> */}
						<Button
							variant="outline"
							size="sm"
							onClick={handleSignOut}
							className="flex items-center space-x-2"
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
