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
import { useToast } from '@/hooks/use-toast';
import { FormDataT, JobInputData } from '@/types/types';
import { Loader2, Plus, X } from 'lucide-react';
import { useState } from 'react';
import JobRequirementItem from './job-requirement-item';
import { JobInput } from './job-tracker';
import { SkillsItem } from './skill-item';

interface AddJobModalProps {
	isOpen: boolean;
	onClose: () => void;
	onJobAdded: (job: JobInput) => void;
}

export function AddJobModal({ isOpen, onClose, onJobAdded }: AddJobModalProps) {
	const [formData, setFormData] = useState<JobInputData>({
		title: '',
		company: '',
		applicationDate: new Date(),
		jobUrl: '',
		skillsRequired: [],
		jobDetails: '',
		jobRequirements: [],
		experienceNeeded: 0,
		notes: '',
		salary: 0,
		location: '',
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();
	const [skill, setSkill] = useState('');
	const [requirements, setRequirements] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const newJob = {
				...formData,
				applicationDate: new Date(formData.applicationDate),
				experienceNeeded: Number(formData.experienceNeeded),
				skillsRequired: JSON.stringify(formData['skillsRequired']),
				jobRequirements: JSON.stringify(formData['jobRequirements']),
				salary: Number(formData.salary),
			};

			onJobAdded(newJob);
			toast({
				title: 'Success',
				description: 'Job application added successfully!',
			});
			handleClose();
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to add job application',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClose = () => {
		setFormData({
			title: '',
			company: '',
			applicationDate: new Date(),
			jobUrl: '',
			jobDetails: '',
			skillsRequired: [],
			jobRequirements: [],
			experienceNeeded: 0,
			notes: '',
			salary: 0,
			location: '',
		});
		onClose();
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
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
									value={formData.title}
									onChange={(e) =>
										setFormData({ ...formData, title: e.target.value })
									}
									required
									className="mt-1"
								/>
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
									placeholder="Enter a Company name.."
									value={formData.company}
									onChange={(e) =>
										setFormData({ ...formData, company: e.target.value })
									}
									required
									className="mt-1"
								/>
							</div>

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
									value={
										formData.applicationDate
											? new Date(formData.applicationDate)
													.toISOString()
													.split('T')[0]
											: ''
									}
									onChange={(e) =>
										setFormData({
											...formData,
											applicationDate: new Date(e.target.value),
										})
									}
									required
									className="mt-1"
								/>
							</div>

							<div className="space-y-2 flex flex-col">
								<Label
									className="text-sm text-neutral-500 font-normal"
									htmlFor="location"
								>
									Location
								</Label>
								<Input
									id="location"
									value={formData.location}
									placeholder="Enter a Company Location.."
									onChange={(e) =>
										setFormData({ ...formData, location: e.target.value })
									}
									className="mt-1"
								/>
							</div>

							<div className="space-y-2 flex flex-col">
								<Label
									className="text-sm text-neutral-500 font-normal"
									htmlFor="salary"
								>
									Salary
								</Label>
								<Input
									id="salary"
									value={formData.salary}
									placeholder="Enter a Job Salary.."
									onChange={(e) =>
										setFormData({ ...formData, salary: Number(e.target.value) })
									}
									className="mt-1"
								/>
							</div>

							<div className="space-y-2 flex flex-col">
								<Label
									className="text-sm text-neutral-500 font-normal"
									htmlFor="experienceNeeded"
								>
									Years of Experience
								</Label>
								<Input
									id="experienceNeeded"
									type="number"
									placeholder="Enter a Year of experiences needed.."
									value={formData.experienceNeeded || 0}
									onChange={(e) =>
										setFormData({
											...formData,
											experienceNeeded: Number(e.target.value),
										})
									}
									className="mt-1"
								/>
							</div>
						</div>
						<div className="space-y-2 flex flex-col">
							<Label
								className="text-sm text-neutral-500 font-normal"
								htmlFor="jobDetail"
							>
								Job Detail
							</Label>
							<Textarea
								id="jobDetail"
								placeholder="Enter a job details.."
								value={formData.jobDetails}
								onChange={(e) =>
									setFormData({ ...formData, jobDetails: e.target.value })
								}
								className="mt-1"
							/>
						</div>

						<div className="space-y-2 flex flex-col">
							<Label
								className="text-sm text-neutral-500 font-normal"
								htmlFor="jobUrl"
							>
								Job URL (optional)
							</Label>
							<Input
								id="jobUrl"
								type="url"
								placeholder="Enter a Job url or link.."
								value={formData.jobUrl}
								onChange={(e) =>
									setFormData({ ...formData, jobUrl: e.target.value })
								}
								className="mt-1"
							/>
						</div>

						<div className="space-y-2 flex flex-col">
							<Label
								className="text-sm text-neutral-500 font-normal"
								htmlFor="skillsRequired"
							>
								Required Skills
							</Label>
							<div className="flex gap-2">
								<Input
									placeholder="Enter a skills.."
									value={skill}
									onChange={(e) => setSkill(e.target.value)}
								></Input>
								<Button
									type="button"
									className="bg-neutral-400 text-white"
									onClick={() => {
										setFormData(() => ({
											...formData,
											skillsRequired: [...formData.skillsRequired, skill],
										}));
										setSkill('');
									}}
								>
									<Plus size={18} />
								</Button>
							</div>
							{formData['skillsRequired'].length != 0 && (
								<div className="flex flex-wrap gap-2">
									{formData['skillsRequired'].map((skill, i) => (
										<SkillsItem key={i}>
											<div className="group flex flex-row items-center gap-2">
												{skill}
												<button
													type="button"
													className="group-hover:flex hidden px-0 py-0"
													onClick={() => {
														setFormData({
															...formData,
															skillsRequired: formData['skillsRequired'].filter(
																(item) => item != skill
															),
														});
													}}
												>
													<X size={16} />
												</button>
											</div>
										</SkillsItem>
									))}
								</div>
							)}
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
									placeholder="Enter job requirements here.."
									value={requirements}
									onChange={(e) => setRequirements(e.target.value)}
								/>
								<Button
									type="button"
									className="bg-neutral-400 text-white"
									onClick={() => {
										setFormData({
											...formData,
											jobRequirements: [
												...formData['jobRequirements'],
												requirements,
											],
										});

										setRequirements('');
									}}
								>
									<Plus size={18}></Plus>
								</Button>
							</div>
							{formData['jobRequirements'].length != 0 && (
								<div className="flex flex-col gap-2 text-sm ">
									{formData['jobRequirements'].map((requirements, i) => (
										<div
											key={i}
											className="group flex flex-row justify-between items-center hover:bg-neutral-100 rounded-full"
										>
											<JobRequirementItem i={i} required={requirements} />
											<Button
												className="group-hover:flex hidden "
												onClick={() =>
													setFormData({
														...formData,
														jobRequirements: formData['jobRequirements'].filter(
															(item) => item != requirements
														),
													})
												}
											>
												<X size={16}></X>
											</Button>
										</div>
									))}
								</div>
							)}
						</div>

						<div className="space-y-2 flex flex-col">
							<Label
								className="text-sm text-neutral-500 font-normal"
								htmlFor="notes"
							>
								Notes
							</Label>
							<Textarea
								id="notes"
								value={formData.notes}
								onChange={(e) =>
									setFormData({ ...formData, notes: e.target.value })
								}
								rows={3}
								className="mt-1"
							/>
						</div>
						<div className="flex space-x-3 pt-4 border-t border-gray-200">
							<Button
								type="submit"
								disabled={isSubmitting || formData['title'] == ''}
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
