/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { AddJobModal } from '@/components/job-add-modal';
import { JobCard } from '@/components/job-card';
import { JobSummarizerModal } from '@/components/job-summarizer-modal';
import { Button } from '@/components/ui/button';
import { queryClient } from '@/lib/react-query';
import { fetcher } from '@/lib/utils';
import { JobStatus, JobType } from '@/types/types';
import { useMutation } from '@tanstack/react-query';
import { Plus, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { JobsResponse } from './dashboard-client-wrapper';
import { Card } from './ui/card';

export interface JobInput {
	title: string;
	company: string;
	jobUrl?: string;
	applicationDate: Date; // from form
	jobDetails: string;
	skillsRequired: string;
	jobRequirements: string;
	experienceNeeded: number | null;
	salary?: number;
	notes?: string;
	location?: string;
}

export function JobTracker({
	jobs,
	isLoading,
}: {
	jobs: JobType[] | null | undefined;
	isLoading: boolean;
}) {
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isSummarizerModalOpen, setIsSummarizerModalOpen] = useState(false);
	const [filter, setFilter] = useState<JobStatus | 'ALL'>('ALL');

	// add new Job
	const addJobMutation = useMutation({
		mutationFn: (newJob: Partial<JobType>) =>
			fetcher<JobInput>(`${process.env.NEXT_PUBLIC_API_URL}/jobs/create`, {
				method: 'POST',
				body: JSON.stringify(newJob),
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['jobs-data'] });
		},
	});

	// updating the job data
	const updateJobMutation = useMutation({
		mutationFn: (job: Partial<JobType>) =>
			fetcher<JobType>(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${job.id}`, {
				method: 'PATCH',
				body: JSON.stringify(job),
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['jobs-data'] });
		},
	});

	const changeStatusMutation = useMutation({
		mutationFn: ({ status, id }: { status: JobStatus; id: string }) =>
			fetcher(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`, {
				method: 'PATCH',
				body: JSON.stringify({ status }),
			}),
		// OPTIMISTIC UPDATE
		onMutate: async (newStatus) => {
			await queryClient.cancelQueries({ queryKey: ['jobs-data'] });
			await queryClient.cancelQueries({ queryKey: ['jobs-analytics'] });

			const previousJobs = queryClient.getQueryData<JobType[]>(['jobs-data']);
			const previousAnalytics = queryClient.getQueryData(['jobs-analytics']);

			// update UI instantly
			queryClient.setQueryData<JobsResponse>(['jobs-data'], (old: any) => {
				if (!old) return old;
				return {
					...old,
					jobs: old.jobs.map((job: JobType) =>
						job.id === newStatus.id ? { ...job, status: newStatus.status } : job
					),
				};
			});

			return { previousJobs, previousAnalytics };
		},

		// ERROR: rollback changes
		onError: (_err, _vars, ctx) => {
			if (ctx?.previousJobs)
				queryClient.setQueryData(['jobs-data'], ctx.previousJobs);

			if (ctx?.previousAnalytics)
				queryClient.setQueryData(['jobs-analytics'], ctx.previousAnalytics);

			toast.error('Error', { description: 'Failed to update status.' });
		},
		// SUCCESS: refetch to sync with DB
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['jobs-data'] });
			queryClient.invalidateQueries({ queryKey: ['jobs-analytics'] });
		},
	});

	// deleting the job
	const deleteJobMutation = useMutation({
		mutationFn: (id: string) =>
			fetcher(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`, {
				method: 'DELETE',
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['jobs-data'] });
		},
	});
	if (!jobs) {
		<p>Loading jobs</p>;
		return;
	}
	const handleJobAdded = (newJob: JobInput) => {
		addJobMutation.mutate(newJob);
		setIsAddModalOpen(false);
	};

	const handleJobUpdated = (updatedJob: JobInput) => {
		updateJobMutation.mutate(updatedJob);
	};

	const handleStatusChange = (status: JobStatus, id: string) => {
		changeStatusMutation.mutate({ status, id });
	};

	const handleJobDeleted = (jobId: string) => {
		if (confirm('Are you sure you want to delete this job application?')) {
			deleteJobMutation.mutate(jobId);
		}
	};

	const filteredJobs =
		filter === 'ALL' ? jobs : jobs.filter((job) => job.status === filter);

	const statusCounts = {
		APPLIED: jobs.filter((job) => job.status === 'APPLIED').length,
		INTERVIEWING: jobs.filter((job) => job.status === 'INTERVIEWING').length,
		OFFER: jobs.filter((job) => job.status === 'OFFER').length,
		REJECTED: jobs.filter((job) => job.status === 'REJECTED').length,
	};

	if (isLoading) {
		return (
			<div className="bg-white rounded-lg shadow p-6">
				<div className="animate-pulse">
					<div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
					<div className="space-y-3">
						<div className="h-20 bg-gray-200 rounded"></div>
						<div className="h-20 bg-gray-200 rounded"></div>
						<div className="h-20 bg-gray-200 rounded"></div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<Card className="bg-white rounded-lg shadow">
			<div className="p-3 md:p-6 border-b">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-xl font-semibold text-gray-900">
						Job Applications
					</h2>
					<div className="hidden md:flex space-x-2 ">
						<Button
							onClick={() => setIsSummarizerModalOpen(true)}
							className="button-icon"
						>
							<Sparkles className="h-4 w-4" />
							<span>AI Summarize</span>
						</Button>
						<Button
							onClick={() => setIsAddModalOpen(true)}
							className="button-icon"
						>
							<Plus className="h-4 w-4" />
							<span>Add Job</span>
						</Button>
					</div>
					<div className="flex space-x-2 md:hidden">
						<Button
							onClick={() => setIsSummarizerModalOpen(true)}
							className="button-icon"
						>
							<Sparkles size={16} />
							<span>AI</span>
						</Button>
						<Button
							onClick={() => setIsAddModalOpen(true)}
							className="button-icon"
						>
							<Plus size={18} />
							Add
						</Button>
					</div>
				</div>

				{/* Status Filter */}
				<div className="flex flex-wrap md:justify-start justify-center space-x-2 mb-4 gap-y-2">
					<Button
						className={
							filter === 'ALL'
								? 'filter-button-active'
								: 'filter-button-inactive'
						}
						size="sm"
						onClick={() => setFilter('ALL')}
					>
						All ({jobs.length})
					</Button>
					<Button
						className={
							filter === 'APPLIED'
								? 'filter-button-active'
								: 'filter-button-inactive'
						}
						size="sm"
						onClick={() => setFilter('APPLIED')}
					>
						Applied ({statusCounts.APPLIED})
					</Button>
					<Button
						className={
							filter === 'INTERVIEWING'
								? 'filter-button-active'
								: 'filter-button-inactive'
						}
						size="sm"
						onClick={() => setFilter('INTERVIEWING')}
					>
						Interviewing ({statusCounts.INTERVIEWING})
					</Button>
					<Button
						className={
							filter === 'OFFER'
								? 'filter-button-active'
								: 'filter-button-inactive'
						}
						size="sm"
						onClick={() => setFilter('OFFER')}
					>
						Offer ({statusCounts.OFFER})
					</Button>
					<Button
						className={
							filter === 'REJECTED'
								? 'filter-button-active'
								: 'filter-button-inactive'
						}
						size="sm"
						onClick={() => setFilter('REJECTED')}
					>
						Rejected ({statusCounts.REJECTED})
					</Button>
				</div>
			</div>

			<div className="p-4 md:p-6">
				{filteredJobs.length === 0 ? (
					<div className="text-center py-12">
						<div className="text-gray-400 mb-4">
							<Plus className="h-12 w-12 mx-auto" />
						</div>
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							No jobs found
						</h3>
						<p className="text-gray-500 mb-4">
							{filter === 'ALL'
								? 'Start tracking your job applications by adding your first job.'
								: `No jobs with status "${filter.toLowerCase()}".`}
						</p>
						<Button
							className="button-icon"
							onClick={() => setIsAddModalOpen(true)}
						>
							Add Your First Job
						</Button>
					</div>
				) : (
					<div className="space-y-4">
						{filteredJobs.map((job) => (
							<JobCard
								key={job.id}
								job={job}
								onUpdate={handleJobUpdated}
								onDelete={handleJobDeleted}
								onStatusChange={handleStatusChange}
							/>
						))}
					</div>
				)}
			</div>
			<AddJobModal
				isOpen={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
				onJobAdded={handleJobAdded}
			/>

			<JobSummarizerModal
				isOpen={isSummarizerModalOpen}
				onClose={() => setIsSummarizerModalOpen(false)}
				onJobAdded={handleJobAdded}
			/>
		</Card>
	);
}
