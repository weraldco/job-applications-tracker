'use client';
import { Sidebar } from '@/components/sidebar';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { ReactNode } from 'react';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
	const { user, loading } = useAuthGuard({
		redirectIfNotAuthenticated: true,
		redirectPath: '/auth/signin',
	});

	const userName = user?.user_metadata?.displayName || 'User';
	const userEmail = user?.email || '';
	return (
		<div className="min-h-screen h-screen bg-gray-50 flex lg:pl-62">
			<Sidebar userName={userName} userEmail={userEmail} />
			<main className="flex-1 lg:ml-0 mt-16 lg:mt-0 relative z-10 flex flex-col">
				{children}
			</main>
		</div>
	);
};

export default DashboardLayout;
