'use client';

import { JobDetailModal } from '@/components/job-detail-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { JobType } from '@/types/types';
import { Job, JobStatus } from '@prisma/client';
import { format } from 'date-fns';
import { Calendar, ExternalLink, MapPin, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { JobInput } from './job-tracker';

interface JobCardProps {
	job: JobType;
	onUpdate: (job: JobInput) => void;
	onDelete: (jobId: string) => void;
	onStatusChange: (status: JobStatus, id: string) => void;
}

export const statusColors = {
	APPLIED: 'bg-[#5690FB] text-white',
	INTERVIEWING: 'bg-[#FBD256]/70 text-yellow-800',
	OFFER: 'bg-[#32CA41]/70 text-green-800',
	REJECTED: 'bg-[#FF5B5B]/70 text-red-800',
	WITHDRAWN: 'bg-[#C4C6C9] text-gray-800',
};

export function JobCard({
	job,
	onUpdate,
	onDelete,
	onStatusChange,
}: JobCardProps) {
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

	return (
		<>
			<div
				className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer "
				onClick={() => setIsDetailModalOpen(true)}
			>
				<div className="flex items-start justify-between ">
					<div className="flex flex-col gap-3 w-full ">
						<div className="card-header flex flex-row items-start justify-between ">
							<div className="w-full">
								<div className="flex items-start">
									<div className="flex flex-col  w-full md:max-w-[80%] ">
										<h3 className="text-lg font-semibold text-gray-900 w-full max-w-[80%]">
											{job.title}
										</h3>
										<p className="text-gray-600">{job.company}</p>
									</div>
									<div className="w-full max-w-[110px] ">
										<Badge
											className={`${statusColors[job.status]} px-3 py-1 mt-1 `}
										>
											{job.status}
										</Badge>
									</div>
								</div>
							</div>
							{/* Card Header Button */}
							<div className="flex items-center justify-end space-x-2  max-w-[100px] w-full ">
								{job.jobUrl && (
									<Button
										className="secondary-btn"
										size="sm"
										onClick={(e) => {
											e.stopPropagation();
											window.open(job.jobUrl ?? undefined, '_blank');
										}}
									>
										<ExternalLink className="h-4 w-4" />
									</Button>
								)}

								<Button
									size="sm"
									className="secondary-btn"
									onClick={(e) => {
										e.stopPropagation();
										onDelete(job.id);
									}}
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						</div>

						<div className="flex space-x-4 text-sm flex-col md:flex-row  gap-y-2">
							<div className="flex items-center space-x-1 w-full md:max-w-[40%] gap-2">
								<span className="flex flex-row gap-1 text-gray-500">
									<Calendar className="h-4 w-4" />
									Applied
								</span>
								<span className="">
									{format(new Date(job.applicationDate), 'MMM dd, yyyy')}
								</span>
							</div>

							{job.location && (
								<div className="flex items-center space-x-1 w-full md:max-w-[60%] ">
									<MapPin className=" text-gray-500" size={16} />
									<span>{job.location}</span>
								</div>
							)}
						</div>
						<div className="flex space-x-4 text-sm flex-col md:flex-row  gap-y-2 md:items-center">
							<div className="w-full max-w-[40%]">
								{job.experienceNeeded !== null && (
									<div className="">
										<p className="text-sm flex gap-2">
											<span className=" text-gray-500">Experience Needed:</span>
											{job.experienceNeeded ? job.experienceNeeded : 0} years
										</p>
									</div>
								)}
							</div>
							<div className="relative">
								<select
									value={job.status}
									onChange={(e) =>
										onStatusChange(e.target.value as JobStatus, job.id)
									}
									className="text-sm cursor-pointer rounded px-2 py-2 secondary-btn"
									onClick={(e) => e.stopPropagation()}
								>
									<option value="APPLIED">Applied</option>
									<option value="INTERVIEWING">Interviewing</option>
									<option value="OFFER">Offer</option>
									<option value="REJECTED">Rejected</option>
									<option value="WITHDRAWN">Withdrawn</option>
								</select>
							</div>
						</div>
					</div>
				</div>
			</div>

			<JobDetailModal
				job={job}
				isOpen={isDetailModalOpen}
				onClose={() => setIsDetailModalOpen(false)}
				onUpdate={onUpdate}
			/>
		</>
	);
}
