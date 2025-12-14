'use client';
import { JobsResponse } from '@/components/dashboard-client-wrapper';
import { JobTracker } from '@/components/job-tracker';
import LoadingState from '@/components/loading-state';
import { fetcher } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

const JobsPage = () => {
	const { data, isLoading, error } = useQuery<JobsResponse>({
		queryKey: ['jobs-data'],
		queryFn: () => fetcher(`${process.env.NEXT_PUBLIC_API_URL}/jobs`),
	});

	if (isLoading) return <LoadingState />;
	if (error) return <p>Error fetching data!</p>;
	return (
		<div className="flex-1 p-4 lg:p-6">
			<div className="grid grid-cols-1  gap-6">
				<div className="lg:col-span-2">
					<JobTracker jobs={data?.jobs} isLoading={isLoading} />
				</div>
			</div>
		</div>
	);
};

export default JobsPage;
