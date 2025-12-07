'use client';
import { AnalyticsDashboard } from '@/components/analytics-panel';
import { Header } from '@/components/header';
import { JobTracker } from '@/components/job-tracker';
import { RemindersPanel } from '@/components/reminders-panel';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { fetcher } from '@/lib/utils';
import { JobType } from '@/types/types';
import { useQuery } from '@tanstack/react-query';
import LoadingState from './loading-state';

export interface JobsResponse {
	jobs: JobType[]; // your existing Job interface
	monthCount: Record<string, number>;
	statusCount: Record<string, number>;
	total: number;
}

export default function DashboardClientWrapper() {
	const { user, loading } = useAuthGuard({
		redirectIfNotAuthenticated: true,
		redirectPath: '/auth/signin',
	});
	const { data, isLoading, error } = useQuery<JobsResponse>({
		queryKey: ['jobs-data'],
		queryFn: () => fetcher(`${process.env.NEXT_PUBLIC_API_URL}/jobs`),
	});

	if (loading || isLoading) return <LoadingState />;
	if (error) return <p>Error fetching data!</p>;
	return (
		<div className="min-h-screen bg-gray-50">
			<Header user={user.user_metadata.displayName} />
			<main className="container mx-auto p-4 lg:p-6">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="lg:col-span-2">
						<JobTracker jobs={data?.jobs} isLoading={isLoading} />
					</div>
					<div className="space-y-6">
						<AnalyticsDashboard
							monthlyCount={data?.monthCount}
							statusCount={data?.statusCount}
							total={data?.total}
							isLoading={isLoading}
						/>
						<RemindersPanel jobs={data?.jobs} />
					</div>
				</div>
			</main>
		</div>
	);
}
