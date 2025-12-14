'use client';
import { AnalyticsDashboard } from '@/components/analytics-panel';
import { JobTracker } from '@/components/job-tracker';
import { RemindersPanel } from '@/components/reminders-panel';
import { Sidebar } from '@/components/sidebar';
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
	const { data, isLoading, error } = useQuery<JobsResponse>({
		queryKey: ['jobs-data'],
		queryFn: () => fetcher(`${process.env.NEXT_PUBLIC_API_URL}/jobs`),
	});

	if (isLoading) return <LoadingState />;
	if (error) return <p>Error fetching data!</p>;

	return (
		<div className="flex-1 p-4 lg:p-6">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 flex flex-col gap-6	">
					<JobTracker jobs={data?.jobs} isLoading={isLoading} />
					<RemindersPanel jobs={data?.jobs} />
				</div>

				<div className="space-y-6">
					<AnalyticsDashboard
						monthlyCount={data?.monthCount}
						statusCount={data?.statusCount}
						total={data?.total}
						isLoading={isLoading}
					/>
				</div>
			</div>
		</div>
	);
}
