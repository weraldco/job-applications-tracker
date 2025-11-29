'use client';
import { AnalyticsDashboard } from '@/components/analytics-dashboard';
import { Header } from '@/components/header';
import { JobTracker } from '@/components/job-tracker';
import { RemindersPanel } from '@/components/reminders-panel';
import { useAuthGuard } from '@/lib/useAuthGuard';

export default function DashboardClientWrapper() {
	const { user, loading } = useAuthGuard();

	if (loading) return <p>Loading..</p>;

	console.log('USER_DATA', user.user_metadata.displayName);

	return (
		<div className="min-h-screen bg-gray-50">
			<Header user={user.user_metadata.displayName} />
			<main className="container mx-auto p-4 lg:p-6">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="lg:col-span-2">
						<JobTracker />
					</div>
					<div className="space-y-6">
						<AnalyticsDashboard />
						<RemindersPanel />
					</div>
				</div>
			</main>
		</div>
	);
}
