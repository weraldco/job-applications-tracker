/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { fetcher, urlConstructor } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { Check, Loader2, Plus, Sparkles, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import JobRequirementItem from './job-requirement-item';
import { JobInput } from './job-tracker';
import { SkillsItem } from './skill-item';

//zod and rhf imports
import { JobsSchema, JobsSchemaType } from '@/schemas/jobs.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

interface JobSummarizerModalProps {
	isOpen: boolean;
	onClose: () => void;
	onJobAdded: (job: JobInput) => void;
}

export interface SummarizedJob {
	title: string;
	company: string;
	jobUrl?: string;
	applicationDate: Date;
	jobDetails: string;
	skillsRequired: string[];
	jobRequirements: string[];
	experienceNeeded: number | null;
	notes?: string;
	location?: string;
	salary?: number;
}

interface ResponseT {
	message: string;
	result: JobsSchemaType;
}
export function JobSummarizerModal({
	isOpen,
	onClose,
	onJobAdded,
}: JobSummarizerModalProps) {
	const [textData, setTextData] = useState('');
	const [url, setUrl] = useState('');
	const [file, setFile] = useState<File | null>(null);

	const [isLoading, setIsLoading] = useState(false);
	const [summarizedJob, setSummarizedJob] = useState<JobsSchemaType | null>(
		null
	);

	const [skill, setSkill] = useState('');
	const [requirements, setRequirements] = useState('');

	const [jobData, setJobData] = useState<JobsSchemaType | null>(null);

	const [isJobDescription, setIsJobDescription] = useState(false);
	const [isJobFile, setIsJobFile] = useState(false);
	const [isJobUrl, setIsJobUrl] = useState(false);
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
			experienceNeeded: undefined,
			notes: '',
			salary: undefined,
			location: '',
		},
	});
	useEffect(() => {
		async function fetchJob() {
			setIsLoading(true);
			try {
				if (summarizedJob == null) return;
				const formattedData = {
					...summarizedJob,
					applicationDate: String(new Date()),
					experienceNeeded: summarizedJob.experienceNeeded
						? Number(summarizedJob.experienceNeeded)
						: 0,
					jobUrl: summarizedJob.jobUrl || '',
					location: summarizedJob.location || '',
					salary: summarizedJob.salary ? Number(summarizedJob.salary) : 0,
					notes: summarizedJob.notes || '',
				};

				setJobData(formattedData);
				reset({
					...summarizedJob,
					applicationDate: new Date().toISOString().split('T')[0],
				}); // <-- important! reset form with fetched
			} catch (err) {
				console.error(err);
			} finally {
				setIsLoading(false);
			}
		}

		fetchJob();
	}, [summarizedJob, reset]);

	const globalSummarizer = useMutation({
		mutationFn: ({
			formData,
			endpoint,
		}: {
			formData: FormData;
			endpoint: string;
		}) =>
			fetcher<ResponseT>(`${process.env.NEXT_PUBLIC_API_URL}/ai/${endpoint}`, {
				method: 'POST',
				body: formData,
			}),
		onSuccess: (res) => {
			setSummarizedJob(res.result);
			setIsJobDescription(false);
			setIsJobFile(false);
			setIsJobUrl(false);
		},
		onError: (error: any) => {
			const message =
				error?.message ||
				error?.response?.data?.error ||
				'Error summarizing data';

			toast.error('Error', { description: message });
		},
		onSettled: () => {
			setIsLoading(false);
		},
	});

	const handleSummarize = () => {
		if (!textData && !file && !url) return;
		setIsLoading(true);
		const formData = new FormData();
		let endpoint = '';

		// FILE
		if (file) {
			endpoint = 'parse-file';
			formData.append('fileData', file);
		}
		// TEXT DATA
		else if (textData) {
			if (textData.length < 100) {
				toast.error('Unclear or incomplete job description!', {
					description: 'Make it more descriptive!',
				});
				setIsLoading(false);
				return;
			}
			endpoint = 'parse-text';
			formData.append('textData', textData);
		}
		// URL
		else if (url) {
			const { urlResult, type, error } = urlConstructor(url);
			console.log(urlResult, type);

			if (error) {
				toast.error('Error reconstructing url', {
					description: error,
				});
				setIsLoading(false);
				return;
			}
			endpoint = `parse-url`;
			formData.append('urlData', urlResult);
			formData.append('urlType', type);
		}
		// NO PROVIDED INPUT
		else {
			setIsLoading(false);
			toast('No input provided', {
				description: 'Enter text, upload file or patse a URL!',
			});
			return;
		}
		globalSummarizer.mutate({ formData, endpoint });
	};

	const onSubmit = async (values: JobsSchemaType) => {
		if (!values) return;
		try {
			const newJob = {
				...values,
				applicationDate: new Date(),
				jobUrl: values?.jobUrl ? values.jobUrl : '',
				skillsRequired: JSON.stringify(values.skillsRequired),
				jobRequirements: JSON.stringify(values.jobRequirements),
				salary: values.salary ? Number(values.salary) : 0,
				experienceNeeded: values.experienceNeeded
					? Number(values.experienceNeeded)
					: 0,
			};
			onJobAdded(newJob);
			toast.success('Success', {
				description: 'Job application added successfully!',
			});
			handleClose();
			reset();
		} catch (error) {
			toast.error('Error', {
				description: 'Failed to add job application',
			});

			console.log(error);
		}
	};

	const handleClose = () => {
		setTextData('');
		setSummarizedJob(null);
		setUrl('');
		setIsLoading(false);
		onClose();
	};

	const handleCancel = () => {
		setTextData('');
		setUrl('');
		setFile(null);
		setSummarizedJob(null);
		setIsLoading(false);
	};

	if (!isOpen) return null;
	return (
		<div className="fixed inset-0 bg-neutral-700/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
			<Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
				<CardHeader>
					<CardTitle className="flex items-center space-x-2 justify-between">
						<div className="flex items-center gap-2">
							<Sparkles className="h-5 w-5" />
							<span>AI Job Summarizer</span>
						</div>
						<button
							className="bg-neutral-100 rounded hover:bg-neutral-200 duration-200"
							onClick={handleClose}
						>
							<X />
						</button>
					</CardTitle>
					<CardDescription>
						Paste a job posting URL or text or upload PDF/DOCX to automatically
						extract job information
					</CardDescription>
				</CardHeader>
				{!isJobDescription &&
					!isJobFile &&
					!isJobUrl &&
					summarizedJob === null && (
						<CardContent>
							<div className=" w-full flex items-center justify-center md:flex-row flex-col gap-4">
								<Button
									className="summarizer-btn w-full"
									onClick={() => {
										setIsJobDescription(true);
										setIsJobUrl(false);
										setIsJobFile(false);
									}}
								>
									Use Job Description
								</Button>
								<Button
									className="summarizer-btn w-full"
									onClick={() => {
										setIsJobDescription(false);
										setIsJobUrl(true);
										setIsJobFile(false);
									}}
								>
									Use Job URL
								</Button>
								<Button
									className="summarizer-btn w-full"
									onClick={() => {
										setIsJobDescription(false);
										setIsJobUrl(false);
										setIsJobFile(true);
									}}
								>
									Use File (PDF/Docx)
								</Button>
							</div>
						</CardContent>
					)}
				<CardContent className="space-y-6">
					{isJobDescription && (
						<>
							<div className="space-y-2">
								<Label htmlFor="url">Job Posting Text Description</Label>
								<Textarea
									id="url"
									placeholder="Paste the job posting full description text here..."
									value={textData}
									onChange={(e) => setTextData(e.target.value)}
									rows={4}
								/>
							</div>

							<div className="flex flex-row items-center justify-evenly gap-4">
								<Button
									onClick={handleSummarize}
									disabled={isLoading || !textData}
									className="w-full bg-blue-400 duration-200 hover:bg-blue-500 active:bg-blue-600 text-white"
								>
									{isLoading ? (
										<>
											<Loader2 className="h-4 w-4 mr-2 animate-spin" />
											Analyzing...
										</>
									) : (
										<>
											<Sparkles className="h-4 w-4 mr-2" />
											Summarize Job Posting
										</>
									)}
								</Button>
								<Button
									className="px-10 bg-blue-400 duration-200 hover:bg-blue-500 active:bg-blue-600 text-white"
									onClick={() => {
										setIsJobDescription(false);
										setTextData('');
										handleCancel();
									}}
								>
									Cancel
								</Button>
							</div>
						</>
					)}
					{isJobUrl && (
						<>
							<div className="space-y-2">
								<Label htmlFor="url">Job Posting URL</Label>
								<Textarea
									id="url"
									placeholder="Paste the job posting URL here.. (don't paste shorten or shortcut url)"
									value={url}
									onChange={(e) => setUrl(e.target.value)}
									rows={4}
								/>
							</div>

							<div className="flex flex-row items-center justify-evenly gap-4">
								<Button
									onClick={handleSummarize}
									disabled={isLoading || !url}
									className="w-full bg-blue-400 duration-200 hover:bg-blue-500 active:bg-blue-600 text-white"
								>
									{isLoading ? (
										<>
											<Loader2 className="h-4 w-4 mr-2 animate-spin" />
											Analyzing...
										</>
									) : (
										<>
											<Sparkles className="h-4 w-4 mr-2" />
											Summarize Job Posting
										</>
									)}
								</Button>
								<Button
									className="px-10 bg-blue-400 duration-200 hover:bg-blue-500 active:bg-blue-600 text-white"
									onClick={() => {
										setIsJobUrl(false);
										setUrl('');
										handleCancel();
									}}
								>
									Cancel
								</Button>
							</div>
						</>
					)}
					{isJobFile && (
						<>
							<div>
								<input
									type="file"
									accept=".png,.jpg,.jpeg,.pdf,.docx"
									onChange={(e) => setFile(e.target.files?.[0] ?? null)}
								/>
							</div>
							<div className="flex flex-row items-center justify-evenly gap-4">
								<Button
									onClick={handleSummarize}
									disabled={isLoading || !file}
									className="w-full bg-blue-400 duration-200 hover:bg-blue-500 active:bg-blue-600 text-white"
								>
									{isLoading ? (
										<>
											<Loader2 className="h-4 w-4 mr-2 animate-spin" />
											Analyzing...
										</>
									) : (
										<>
											<Sparkles className="h-4 w-4 mr-2" />
											Summarize Job Posting
										</>
									)}
								</Button>
								<Button
									className="px-10 bg-blue-400 duration-200 hover:bg-blue-500 active:bg-blue-600 text-white"
									onClick={() => {
										setIsJobFile(false);
										setFile(null);
										handleCancel();
									}}
								>
									Cancel
								</Button>
							</div>
						</>
					)}

					{summarizedJob && (
						<div className="space-y-4 border-t pt-4">
							<div className="flex items-center space-x-2 text-green-600">
								<Check className="h-4 w-4" />
								<span className="font-medium">Job Information Extracted</span>
							</div>
							<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="space-y-3">
										<Label
											htmlFor="title"
											className="text-sm font-medium text-gray-700"
										>
											Job Title *
										</Label>
										<Input
											id="title"
											required
											className="mt-1"
											{...register('title')}
										/>
										{errors.title && <p>{errors.title.message}</p>}
									</div>

									<div className="space-y-3">
										<Label
											htmlFor="company"
											className="text-sm font-medium text-gray-700"
										>
											Company *
										</Label>
										<Input
											id="company"
											required
											className="mt-1"
											{...register('company')}
										/>
										{errors.company && <p>{errors.company.message}</p>}
									</div>

									<div className="space-y-3">
										<Label
											htmlFor="applicationDate"
											className="text-sm font-medium text-gray-700"
										>
											Application Date *
										</Label>
										<Input
											id="applicationDate"
											type="date"
											required
											className="mt-1"
											{...register('applicationDate')}
										/>
										{errors.applicationDate && (
											<p>{errors.applicationDate.message}</p>
										)}
									</div>
									<div className="space-y-3">
										<Label
											htmlFor="location"
											className="text-sm font-medium text-gray-700"
										>
											Location
										</Label>
										<Input
											id="location"
											className="mt-1"
											{...register('location')}
										/>
										{errors.location && <p>{errors.location.message}</p>}
									</div>

									<div className="space-y-3">
										<Label
											htmlFor="salary"
											className="text-sm font-medium text-gray-700"
										>
											Salary
										</Label>
										<Input
											type="number"
											id="salary"
											className="mt-1"
											{...register('salary', { valueAsNumber: true })}
										/>
										{errors.salary && <p>{errors.salary.message}</p>}
									</div>

									<div className="space-y-3">
										<Label
											htmlFor="experienceNeeded"
											className="text-sm font-medium text-gray-700"
										>
											Years of Experience
										</Label>
										<Input
											id="experienceNeeded"
											type="number"
											className="mt-1"
											{...register('experienceNeeded', { valueAsNumber: true })}
										/>
										{errors.experienceNeeded && (
											<p>{errors.experienceNeeded.message}</p>
										)}
									</div>
								</div>
								<div className="space-y-3">
									<Label
										htmlFor="jobUrl"
										className="text-sm font-medium text-gray-700"
									>
										Job URL (optional)
									</Label>
									<Input
										id="jobUrl"
										type="url"
										className="mt-1"
										{...register('jobUrl')}
									/>
									{errors.jobUrl && <p>{errors.jobUrl.message}</p>}
								</div>
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
										rows={4}
										className="mt-1"
									/>
									{errors.jobDetails && (
										<p className="text-red-500">{errors.jobDetails.message}</p>
									)}
								</div>
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
								<div className="space-y-3">
									<Label
										htmlFor="notes"
										className="text-sm font-medium text-gray-700"
									>
										Notes
									</Label>
									<Textarea
										id="notes"
										rows={3}
										className="mt-1"
										{...register('notes')}
									/>
									{errors.notes && <p>{errors.notes.message}</p>}
								</div>

								<div className="flex space-x-3 pt-4 border-t border-gray-200">
									<Button
										type="submit"
										disabled={isSubmitting}
										className="button-icon w-full"
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
											handleCancel();
										}}
										className="button-icon"
									>
										Cancel
									</Button>
								</div>
							</form>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
