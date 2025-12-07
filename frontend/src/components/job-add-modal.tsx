'use client';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import UseEscClose from '@/hooks/use-esc-close';

// Zod and RHF
import { JobsSchema, JobsSchemaType } from '@/schemas/jobs.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Loader2, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import JobRequirementItem from './job-requirement-item';
import { JobInput } from './job-tracker';
import { SkillsItem } from './skill-item';

interface AddJobModalProps {
	isOpen: boolean;
	onClose: () => void;
	onJobAdded: (job: JobInput) => void;
}

export function AddJobModal({ isOpen, onClose, onJobAdded }: AddJobModalProps) {
	const {
		register,
		handleSubmit,
		setValue,
		getValues,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<JobsSchemaType>({
		resolver: zodResolver(JobsSchema),
		defaultValues: {
			title: '',
			company: '',
			applicationDate: new Date().toISOString().split('T')[0],
			jobUrl: '',
			jobDetails: '',
			skillsRequired: [],
			jobRequirements: [],
			experienceNeeded: 0,
			notes: '',
			salary: 0,
			location: '',
		},
	});
	const [skill, setSkill] = useState('');
	const [requirements, setRequirements] = useState('');

	const onSubmit = (data: JobsSchemaType) => {
		const newJob = {
			...data,
			applicationDate: new Date(data.applicationDate),
			skillsRequired: JSON.stringify(data.skillsRequired),
			jobRequirements: JSON.stringify(data.jobRequirements),
			experienceNeeded: Number(data.experienceNeeded),
		};
		onJobAdded(newJob);

		toast('Success', {
			description: 'Job application added successfully!',
		});
		handleClose();
	};

	const handleClose = () => {
		onClose();
		reset();
	};

	UseEscClose(handleClose);
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-neutral-700/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
			<Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
				<CardHeader className="pb-4">
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-xl font-semibold text-gray-900">
								Add Job Application
							</CardTitle>
							<CardDescription className="text-gray-600 mt-1">
								Enter the details of your job application
							</CardDescription>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={handleClose}
							className="shrink-0"
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
				</CardHeader>
				<CardContent className="p-6">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
							<div className="space-y-2 flex flex-col">
								<Label
									className="text-sm text-neutral-500 font-normal"
									htmlFor="title"
								>
									Job Title *
								</Label>
								<Input
									id="title"
									placeholder="Enter a Job Title.."
									type="text"
									className="input"
									{...register('title')}
								/>
								{errors.title && (
									<p className="text-red-500">{errors.title.message}</p>
								)}
							</div>
							<div className="space-y-2 flex flex-col">
								<Label
									className="text-sm text-neutral-500 font-normal"
									htmlFor="company"
								>
									Company *
								</Label>
								<Input
									id="company"
									placeholder="Enter a Job Title.."
									type="text"
									className="input"
									{...register('company')}
								/>
								{errors.company && (
									<p className="text-red-500">{errors.company.message}</p>
								)}
							</div>
							{/* Application Date */}
							<div className="space-y-2 flex flex-col">
								<Label
									className="text-sm text-neutral-500 font-normal"
									htmlFor="applicationDate"
								>
									Application Date *
								</Label>
								<Input
									id="applicationDate"
									type="date"
									className="input"
									{...register('applicationDate')}
								/>
								{errors.applicationDate && (
									<p className="text-red-500">
										{errors.applicationDate.message}
									</p>
								)}
							</div>
							{/* Location */}
							<div className="space-y-2 flex flex-col">
								<Label
									className="text-sm text-neutral-500 font-normal"
									htmlFor="location"
								>
									Location (optional)
								</Label>
								<Input
									id="location"
									placeholder="Location of the company.."
									type="text"
									className="input"
									{...register('location')}
								/>
								{errors.location && (
									<p className="text-red-500">{errors.location.message}</p>
								)}
							</div>
							<div className="space-y-2 flex flex-col">
								<Label
									className="text-sm text-neutral-500 font-normal"
									htmlFor="experienceNeeded"
								>
									Experience Needed (optional)
								</Label>
								<Input
									id="experienceNeeded"
									type="number"
									className="input"
									{...register('experienceNeeded', { valueAsNumber: true })}
								/>
								{errors.experienceNeeded && (
									<p className="text-red-500">
										{errors.experienceNeeded.message}
									</p>
								)}
							</div>
							{/* Salary */}
							<div className="space-y-2 flex flex-col">
								<Label
									className="text-sm text-neutral-500 font-normal"
									htmlFor="salary"
								>
									Salary (optional)
								</Label>
								<Input
									id="salary"
									type="number"
									className="input"
									{...register('salary', { valueAsNumber: true })}
								/>
								{errors.salary && (
									<p className="text-red-500">{errors.salary.message}</p>
								)}
							</div>

							{/* Job URL */}
							<div className="space-y-2 flex flex-col">
								<Label
									className="text-sm text-neutral-500 font-normal"
									htmlFor="jobUrl"
								>
									jobUrl (optional)
								</Label>
								<Input
									id="jobUrl"
									placeholder="jobUrl of the company.."
									type="text"
									className="input"
									{...register('jobUrl')}
								/>
								{errors.jobUrl && (
									<p className="text-red-500">{errors.jobUrl.message}</p>
								)}
							</div>
						</div>

						{/* Job Details */}
						<div className="space-y-2 flex flex-col">
							<Label
								className="text-sm text-neutral-500 font-normal"
								htmlFor="jobDetails"
							>
								Job Details
							</Label>
							<Textarea
								id="jobDetails"
								placeholder="Job details or Roles in this job post"
								{...register('jobDetails')}
								rows={3}
								className="mt-1"
							/>
							{errors.jobDetails && (
								<p className="text-red-500">{errors.jobDetails.message}</p>
							)}
						</div>

						{/* Skills Requirements */}
						<div className="space-y-2 flex flex-col">
							<Label
								className="text-sm text-neutral-500 font-normal"
								htmlFor="skillsRequired"
							>
								Skills Requirements
							</Label>
							<div className="flex flex-row gap-2">
								<Input
									className="input"
									value={skill}
									onChange={(e) => setSkill(e.target.value)}
									placeholder="Enter a skill"
								/>
								<Button
									type="button"
									className="bg-neutral-400 text-white"
									onClick={() => {
										const list = getValues('skillsRequired') ?? [];
										if (!skill) return;
										setValue('skillsRequired', [...list, skill]);
										setSkill(''); // clear input
									}}
								>
									<Plus size={18} />
								</Button>
							</div>
							<div className="flex gap-2 text-sm flex-wrap ">
								{(getValues('skillsRequired') ?? []).map((s, i) => (
									<SkillsItem key={i}>{s}</SkillsItem>
								))}
							</div>
						</div>

						{/* Job Requirements */}
						<div className="space-y-2 flex flex-col">
							<Label
								className="text-sm text-neutral-500 font-normal"
								htmlFor="jobRequirements"
							>
								Job Requirements
							</Label>
							<div className="flex flex-row gap-2">
								<Input
									className="input"
									id="jobRequirements"
									value={requirements}
									onChange={(e) => setRequirements(e.target.value)}
									placeholder="Enter a requirements"
								/>
								<Button
									type="button"
									className="bg-neutral-400 text-white"
									onClick={() => {
										const list = getValues('jobRequirements') ?? [];
										if (!requirements) return;
										setValue('jobRequirements', [...list, requirements]);
										setRequirements(''); // clear input
									}}
								>
									<Plus size={18} />
								</Button>
							</div>
							<div className="flex flex-col gap-2 text-sm ">
								{(getValues('jobRequirements') ?? []).map((s, i) => (
									<JobRequirementItem key={i} required={s} i={i} />
								))}
							</div>
						</div>

						{/* Notes */}
						<div className="space-y-2 flex flex-col">
							<Label
								className="text-sm text-neutral-500 font-normal"
								htmlFor="notes"
							>
								Notes (optional)
							</Label>
							<Textarea
								id="notes"
								{...register('notes')}
								rows={3}
								className="mt-1"
							/>
						</div>
						<div className="flex space-x-3 pt-4 border-t border-gray-200">
							<Button
								type="submit"
								disabled={isSubmitting}
								className="button-icon flex-1 "
							>
								{isSubmitting ? (
									<>
										<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										Adding...
									</>
								) : (
									'Add Job Application'
								)}
							</Button>
							<Button
								type="button"
								onClick={handleClose}
								className="button-icon"
							>
								Cancel
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
