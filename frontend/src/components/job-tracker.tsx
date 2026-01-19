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
import { Plus, Search, SearchCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { JobsResponse } from './dashboard-client-wrapper';
import { Card } from './ui/card';
import { Input } from './ui/input';

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
	const [searchQuery, setSearchQuery] = useState('');

	// add new Job
	const addJobMutation = useMutation({
		mutationFn: (newJob: Partial<JobType>) =>
			fetcher<JobInput>(`${process.env.NEXT_PUBLIC_API_URL}/jobs/create`, {
				method: 'POST',
				body: JSON.stringify(newJob),
			}),
		onMutate: async (newJob) => {
			await queryClient.cancelQueries({ queryKey: ['jobs-data'] });

			const previousData = queryClient.getQueryData<JobsResponse>([
				'jobs-data',
			]);
			queryClient.setQueryData<JobsResponse>(['jobs-data'], (old) => {
				if (!old) return old;

				const optimisticJob: JobType = {
					id: Math.random().toString(36).substr(2, 9),

					// REQUIRED FIELDS
					userId: newJob.userId!,
					title: newJob.title ?? '',
					company: newJob.company ?? '',
					status: newJob.status ?? 'APPLIED',
					jobUrl: newJob.jobUrl ?? '',
					jobDetails: newJob.jobDetails ?? '',
					skillsRequired: newJob.skillsRequired ?? '',
					jobRequirements: newJob.jobRequirements ?? '',
					experienceNeeded: newJob.experienceNeeded ?? 0,
					salary: newJob.salary ?? 0,
					location: newJob.location ?? '',

					// OPTIONAL FIELDS
					applicationDate: newJob.applicationDate ?? new Date(),
					notes: newJob.notes ?? '',
					createdAt: new Date(),
					updatedAt: new Date(),

					...newJob, // override any optional properties afterward
				};

				return {
					...old,
					jobs: [...old.jobs, optimisticJob],
				};
			});

			return { previousData };
		},

		onError: (err, newJob, context) => {
			if (context?.previousData) {
				queryClient.setQueryData(['jobs-data'], context.previousData);
			}
			toast.error('Failed to add job');
		},
		onSettled: () => {
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
			queryClient.invalidateQueries({ queryKey: ['reminder-data'] });
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

	const filteredJobs = (
		filter === 'ALL' ? jobs : jobs.filter((job) => job.status === filter)
	).filter(
		(job) =>
			job.title.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()) ||
			job.company.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
	);

	console.log(filteredJobs);
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
		<Card className="bg-white rounded-lg shadow border-0">
			<div className="p-3 md:p-6 border-b border-neutral-200">
				<div className="flex items-start justify-between mb-4">
					<div>
						<h2 className="text-xl font-semibold text-gray-900 flex flex-row gap-2">
							Job Applications
						</h2>
						<span className="text-sm text-neutral-600">
							Manage and organize your job applications.
						</span>
					</div>
					<div className="hidden md:flex space-x-2 ">
						<Button
							onClick={() => setIsSummarizerModalOpen(true)}
							size="sm"
							className="primary-btn"
						>
							<Sparkles className="h-4 w-4" />
							<span>AI Summarize</span>
						</Button>
						<Button
							onClick={() => setIsAddModalOpen(true)}
							size="sm"
							className="primary-btn"
						>
							<Plus className="h-4 w-4" />
							<span>Add Job</span>
						</Button>
					</div>
					<div className="flex space-x-2 md:hidden">
						<Button
							size="sm"
							onClick={() => setIsSummarizerModalOpen(true)}
							className="primary-btn"
						>
							<Sparkles size={16} />
							<span>AI</span>
						</Button>
						<Button
							onClick={() => setIsAddModalOpen(true)}
							size="sm"
							className="primary-btn"
						>
							<Plus size={18} />
							Add
						</Button>
					</div>
				</div>
				<div className="relative mb-4">
					<Input
						placeholder="Search job application.."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="border-gray-1"
					></Input>
					<Search className="absolute top-2 right-2 text-gray-1 " />
				</div>
				{/* Status Filter */}
				<div className="flex flex-wrap md:justify-start justify-center space-x-2 mb-4 gap-y-2">
					<Button
						className={` text-white rounded-lg ${
							filter === 'ALL' ? 'bg-gray-1' : 'bg-gray-1/80'
						}`}
						size="sm"
						onClick={() => setFilter('ALL')}
					>
						All ({jobs.length})
					</Button>
					<Button
						className={` text-white rounded-lg ${
							filter === 'APPLIED' ? 'bg-blue-1' : 'bg-blue-1/80'
						}`}
						size="sm"
						onClick={() => setFilter('APPLIED')}
					>
						Applied ({statusCounts.APPLIED})
					</Button>
					<Button
						className={` text-white rounded-lg ${
							filter === 'INTERVIEWING' ? 'bg-yellow-1' : 'bg-yellow-1/80'
						}`}
						size="sm"
						onClick={() => setFilter('INTERVIEWING')}
					>
						Interviewing ({statusCounts.INTERVIEWING})
					</Button>
					<Button
						className={` text-white rounded-lg ${
							filter === 'OFFER' ? 'bg-green-1' : 'bg-green-1/80'
						}`}
						size="sm"
						onClick={() => setFilter('OFFER')}
					>
						Offer ({statusCounts.OFFER})
					</Button>
					<Button
						className={` text-white rounded-lg ${
							filter === 'REJECTED' ? 'bg-red-1' : 'bg-red-1/80'
						}`}
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
							className="primary-btn"
							onClick={() => setIsAddModalOpen(true)}
						>
							Add Your First Jobs
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
