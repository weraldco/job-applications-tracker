/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import UseEscClose from '@/hooks/use-esc-close';
import { JobStatus, JobType } from '@/types/types';
import { Loader2, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import JobRequirementItem from './job-requirement-item';
import { SkillsItem } from './job-skill-item';
import { JobInput } from './job-tracker';

//zod and rhf imports
import { JobsSchema, JobsSchemaType } from '@/schemas/jobs.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export interface FormDataT {
	id: string;
	title: string;
	company: string;
	applicationDate: Date;
	jobUrl: string | null;
	skillsRequired: string[];
	jobRequirements: string[];
	experienceNeeded: number | null;
	notes: string | null;
	salary: string | null;
	location: string | null;
	status: JobStatus;
	userId: string;
	createdAt: Date;
	updatedAt: Date;
}

interface EditJobModalProps {
	job: JobType;
	isOpen: boolean;
	onClose: () => void;
	setIsEditing: (b: boolean) => void;
	onUpdate: (job: JobInput) => void;
}

export function EditJobModal({
	job,
	isOpen,
	onClose,
	setIsEditing,
	onUpdate,
}: EditJobModalProps) {
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
			notes: '',
			location: '',

			salary: undefined,
			experienceNeeded: undefined,
		},
	});

	useEffect(() => {
		async function fetchJob() {
			setLoading(true);
			try {
				const formattedData = {
					...job,
					id: job.id,
					applicationDate: new Date(job.applicationDate)
						.toISOString()
						.split('T')[0],
					experienceNeeded: Number(job.experienceNeeded),
					skillsRequired: JSON.parse(job.skillsRequired),
					jobRequirements: JSON.parse(job.jobRequirements),
					jobUrl: job.jobUrl || '',
					location: job.location || '',
					salary: Number(job.salary),
					notes: job.notes || '',
				};

				setJobData(formattedData);
				reset(formattedData); // <-- important! reset form with fetched values
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		}

		fetchJob();
	}, [job, reset]);

	const [skill, setSkill] = useState('');
	const [requirements, setRequirements] = useState('');
	const [loading, setLoading] = useState(false);
	const [jobData, setJobData] = useState<JobsSchemaType | null>(null);

	UseEscClose(onClose);
	if (!isOpen) return null;
	if (loading) return <p>Loading..</p>;

	const onSubmit = (data: JobsSchemaType) => {
		const newJob = {
			...data,
			id: job.id,
			experienceNeeded: data.experienceNeeded || 0,
			applicationDate: new Date(data.applicationDate),
			skillsRequired: JSON.stringify(data.skillsRequired),
			jobRequirements: JSON.stringify(data.jobRequirements),
		};
		onUpdate(newJob);

		toast('Success', {
			description: 'Job application added successfully!',
		});

		reset();
		onClose();
		setIsEditing(false);
	};
	return (
		<>
			<Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-0">
				<CardHeader className="border-b border-neutral-200">
					<div className="flex flex-row justify-between">
						<div className="flex flex-col gap-2">
							<h1 className="text-xl font-semibold">Update Job Posting</h1>
							<span className="text-sm">
								Edit the details in this job posting that you want to change
							</span>
						</div>
						<Button
							className="secondary-btn"
							size="sm"
							onClick={() => {
								setIsEditing(false);
							}}
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
				</CardHeader>
				<CardContent className="p-6">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-3">
								<Label htmlFor="title" className="input-label">
									Job Title *
								</Label>
								<Input
									id="title"
									required
									className="input-field"
									{...register('title')}
								/>
								{errors.title && <p>{errors.title.message}</p>}
							</div>

							<div className="space-y-3">
								<Label htmlFor="company" className="text-sm text-gray-400">
									Company *
								</Label>
								<Input
									id="company"
									required
									className="input-field"
									{...register('company')}
								/>
								{errors.company && <p>{errors.company.message}</p>}
							</div>

							<div className="space-y-3">
								<Label htmlFor="applicationDate" className="input-label">
									Application Date *
								</Label>
								<Input
									id="applicationDate"
									type="date"
									required
									className="input-field"
									{...register('applicationDate')}
								/>
								{errors.applicationDate && (
									<p>{errors.applicationDate.message}</p>
								)}
							</div>

							<div className="space-y-3">
								<Label htmlFor="location" className="input-label">
									Location
								</Label>
								<Input
									id="location"
									className="input-field"
									{...register('location')}
								/>
								{errors.location && <p>{errors.location.message}</p>}
							</div>

							<div className="space-y-3">
								<Label htmlFor="salary" className="input-label">
									Salary
								</Label>
								<Input
									id="salary"
									className="input-field"
									{...register('salary')}
								/>
								{errors.salary && <p>{errors.salary.message}</p>}
							</div>

							<div className="space-y-3">
								<Label htmlFor="experienceNeeded" className="input-label">
									Years of Experience
								</Label>
								<Input
									id="experienceNeeded"
									type="number"
									className="input-field"
									{...register('experienceNeeded')}
								/>
								{errors.experienceNeeded && (
									<p>{errors.experienceNeeded.message}</p>
								)}
							</div>
						</div>

						<div className="space-y-3">
							<Label htmlFor="jobUrl" className="input-label">
								Job URL
							</Label>
							<Input
								id="jobUrl"
								type="url"
								className="input-field"
								placeholder="Enter a job url.."
								{...register('jobUrl')}
							/>
							{errors.jobUrl && <p>{errors.jobUrl.message}</p>}
						</div>
						<div className="space-y-2 flex flex-col">
							<Label className="input-label" htmlFor="jobDetails">
								Job Details
							</Label>
							<Textarea
								id="jobDetails"
								placeholder="Job details or job roles.."
								{...register('jobDetails')}
								rows={4}
								className="input-field"
							/>
							{errors.jobDetails && (
								<p className="text-red-500">{errors.jobDetails.message}</p>
							)}
						</div>
						<div className="space-y-2 flex flex-col">
							<Label className="input-label" htmlFor="skillsRequired">
								Skills Requirements
							</Label>
							<div className="flex flex-row gap-2">
								<Input
									className="input-field"
									value={skill}
									onChange={(e) => setSkill(e.target.value)}
									placeholder="Enter a skill.."
								/>
								<Button
									type="button"
									size="sm"
									className="bg-neutral-500 hover:bg-neutral-500/90 active:bg-neutral-600 duration-200 text-white py-5"
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
						<div className="space-y-2 flex flex-col">
							<Label className="input-label" htmlFor="jobRequirements">
								Job Requirements
							</Label>
							<div className="flex flex-row gap-2">
								<Input
									className="input-field"
									id="jobRequirements"
									value={requirements}
									onChange={(e) => setRequirements(e.target.value)}
									placeholder="Enter a requirements.."
								/>
								<Button
									type="button"
									size="sm"
									className="bg-neutral-500 hover:bg-neutral-500/90 active:bg-neutral-600 duration-200 text-white py-5"
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
						<div className="space-y-3">
							<Label htmlFor="notes" className="input-label">
								Notes
							</Label>
							<Textarea
								id="notes"
								rows={3}
								className="mt-1 input-field"
								placeholder="Enter a notes.."
								{...register('notes')}
							/>
							{errors.notes && <p>{errors.notes.message}</p>}
						</div>

						<div className="flex space-x-3 pt-4 border-t border-gray-200">
							<Button
								type="submit"
								disabled={isSubmitting}
								className="primary-btn w-full"
							>
								{isSubmitting ? (
									<>
										<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										Updating...
									</>
								) : (
									'Update Job Application'
								)}
							</Button>
							<Button
								type="button"
								onClick={() => {
									setIsEditing(false);
								}}
								className="primary-btn"
							>
								Cancel
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</>
	);
}
