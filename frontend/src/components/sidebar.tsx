'use client';

import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import {
	Bell,
	Briefcase,
	Calendar,
	History,
	LayoutDashboard,
	LogOut,
	Menu,
	User,
	X,
} from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface SidebarProps {
	userName: string;
	userEmail?: string;
}

export function Sidebar({ userName, userEmail }: SidebarProps) {
	const router = useRouter();
	const pathname = usePathname();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const menuItems = [
		{ name: 'Dashboard', icon: LayoutDashboard, path: '/' },
		{ name: 'Jobs', icon: Briefcase, path: '/jobs' },
		{ name: 'Reminders', icon: Bell, path: '/reminders' },
		{ name: 'Calendar', icon: Calendar, path: '/calendar' },
		{ name: 'History', icon: History, path: '/history' },
	];

	const handleNavigation = (path: string) => {
		router.push(path);
		setIsMobileMenuOpen(false);
	};

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
				description: 'Something went wrong, cannot sign out..',
			});
		}
		localStorage.removeItem('supabase_token');
	};

	return (
		<>
			{/* Mobile Header - Always visible on mobile */}
			<header className="lg:hidden fixed top-0 left-0 right-0 w-full h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4">
				<div className="flex items-center h-full">
					<Image
						src="/images/logo/jobstashr-logo-horizontal.svg"
						alt="logo"
						width={200}
						height={200}
						className="h-10 object-contain"
					/>
				</div>
				<button
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					className="secondary-btn p-2"
					aria-label="Toggle menu"
				>
					{isMobileMenuOpen ? (
						<X className="h-5 w-5" />
					) : (
						<Menu className="h-5 w-5" />
					)}
				</button>
			</header>

			{/* Mobile Overlay - Lighter so dashboard is visible */}
			{isMobileMenuOpen && (
				<div
					className="lg:hidden fixed inset-0 bg-black/20 bg-opacity-20 z-30"
					onClick={() => setIsMobileMenuOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={`
					fixed  left-0 z-40
					top-16 lg:top-0 lg:inset-y-0
					w-64 h-[calc(100vh-4rem)] bottom:0 lg:h-full
					bg-white border-r border-gray-200
					flex flex-col
					transform transition-transform duration-300 ease-in-out
					lg:translate-x-0
					lg:shadow-none shadow-xl
					${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
				`}
			>
				{/* Logo/Header */}
				<div className="border-gray-200 hidden lg:flex ">
					<div className="flex flex-col h-full p-6 border-b border-neutral-200 ">
						<Image
							src="/images/logo/jobstashr-logo-vertical.svg"
							alt="logo"
							width={200}
							height={200}
							className="h-30 object-contain"
						/>
						<span className="text-sm text-center text-neutral-500">
							Manage and track your applications
						</span>
					</div>
				</div>

				{/* Navigation Menu */}
				<nav className="flex-1 p-4 overflow-y-auto">
					<div className="space-y-1">
						{menuItems.map((item) => {
							const Icon = item.icon;
							const isActive = pathname === item.path;
							return (
								<button
									key={item.name}
									onClick={() => handleNavigation(item.path)}
									className={`
									group w-full flex items-center space-x-3 px-4 py-3 rounded-lg
										transition-colors duration-150
										${
											isActive
												? 'bg-orange-50 text-orange-600 font-medium'
												: 'text-gray-700 hover:bg-gray-100 active:bg-neutral-200'
										}
									`}
								>
									<Icon className="h-5 w-5 group-hover:text-orange-400 group-active:text-orange-500" />
									<span className="text-sm">{item.name}</span>
								</button>
							);
						})}
					</div>
				</nav>

				{/* User Info and Logout */}
				<div className="p-6 border-t border-gray-200 space-y-4">
					{/* User Info */}
					<div className="flex items-center space-x-3 p-3 bg-neutral-100 rounded-lg">
						<div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
							<User className="h-5 w-5" />
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium text-gray-900 truncate">
								{userName}
							</p>
							{userEmail && (
								<p className="text-xs text-gray-500 truncate">{userEmail}</p>
							)}
						</div>
					</div>

					{/* Logout Button */}
					<Button
						variant="outline"
						onClick={handleSignOut}
						className="secondary-btn w-full flex flex-row gap-2"
					>
						<LogOut className="h-4 w-4" />
						<span>Logout</span>
					</Button>
				</div>
			</aside>
		</>
	);
}
