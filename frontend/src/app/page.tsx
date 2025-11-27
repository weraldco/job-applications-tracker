import { AnalyticsDashboard } from '@/components/analytics-dashboard';
import { Header } from '@/components/header';
import { JobTracker } from '@/components/job-tracker';
import { RemindersPanel } from '@/components/reminders-panel';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
	const session = await auth();

	if (!session?.user) {
		redirect('/auth/signin');
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Header />
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
