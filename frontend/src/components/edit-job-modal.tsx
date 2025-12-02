'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { JobType } from '@/types/types';
import { Job, JobStatus } from '@prisma/client';
import { Loader2, Plus, X } from 'lucide-react';
import { useState } from 'react';
import JobRequirementItem from './job-requirement-item';
import { JobInput } from './job-tracker';
import { SkillsItem } from './skill-item';

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
	const [formData, setFormData] = useState<JobInput>({
		...job,
		skillsRequired: JSON.parse(job.skillsRequired),
		jobRequirements: JSON.parse(job.jobRequirements),
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [skill, setSkill] = useState('');
	const [requirements, setRequirements] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		// updateJobMutation.mutate({ id: formData.id, data: formData });

		// Lets make a newData that will convert back to string the skills and requirements
		const newData = {
			...formData,
			skillsRequired: JSON.stringify(formData['skillsRequired']),
			jobRequirements: JSON.stringify(formData['jobRequirements']),
		};
		onUpdate(newData);
		setIsEditing(false);
		setIsSubmitting(false);
	};

	if (!isOpen) return null;
	console.log('Job', formData.skillsRequired);
	return (
		<>
			<Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white ">
				<CardHeader>
					<div className="flex flex-row justify-between">
						<div className="flex flex-col gap-2">
							<h1 className="text-xl font-semibold">Update Job Posting</h1>
							<span className="text-sm">
								Edit the details in this job posting that you want to change
							</span>
						</div>
						<Button
							className="secondary-btn"
							onClick={() => {
								setIsEditing(false);
							}}
						>
							<X size={18}></X>
						</Button>
					</div>
				</CardHeader>
				<CardContent className="p-6">
					<form onSubmit={handleSubmit} className="space-y-6">
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
									value={formData.title}
									onChange={(e) =>
										setFormData({ ...formData, title: e.target.value })
									}
									required
									className="mt-1"
								/>
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
									value={formData.company}
									onChange={(e) =>
										setFormData({ ...formData, company: e.target.value })
									}
									required
									className="mt-1"
								/>
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

							<div className="space-y-3">
								<Label
									htmlFor="location"
									className="text-sm font-medium text-gray-700"
								>
									Location
								</Label>
								<Input
									id="location"
									value={formData.location ?? ''}
									onChange={(e) =>
										setFormData({ ...formData, location: e.target.value })
									}
									className="mt-1"
								/>
							</div>

							<div className="space-y-3">
								<Label
									htmlFor="salary"
									className="text-sm font-medium text-gray-700"
								>
									Salary
								</Label>
								<Input
									id="salary"
									value={Number(formData.salary)}
									onChange={(e) =>
										setFormData({ ...formData, salary: e.target.value })
									}
									className="mt-1"
								/>
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
									value={Number(formData.experienceNeeded)}
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

						<div className="space-y-3">
							<Label
								htmlFor="jobUrl"
								className="text-sm font-medium text-gray-700"
							>
								Job URL
							</Label>
							<Input
								id="jobUrl"
								type="url"
								value={formData.jobUrl ?? ''}
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
										setFormData({
											...formData,
											skillsRequired: [...formData['skillsRequired'], skill],
										});
										setSkill('');
									}}
								>
									<Plus size={18} />
								</Button>
							</div>
							{formData['skillsRequired'].length != 0 && (
								<div className="flex flex-wrap gap-2">
									{formData['skillsRequired'].map(
										(skill: string, i: number) => (
											<SkillsItem key={i}>
												<div className="group flex flex-row items-center gap-2">
													{skill}
													<button
														type="button"
														className="group-hover:flex hidden px-0 py-0"
														onClick={() => {
															setFormData({
																...formData,
																skillsRequired: formData[
																	'skillsRequired'
																].filter((item) => item != skill),
															});
														}}
													>
														<X size={16} />
													</button>
												</div>
											</SkillsItem>
										)
									)}
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
									}}
								>
									<Plus size={18}></Plus>
								</Button>
							</div>
							{formData['jobRequirements'].length != 0 && (
								<div className="flex flex-col gap-2 text-sm ">
									{formData['jobRequirements'].map(
										(requirements: string, i: number) => (
											<div
												key={i}
												className="group flex flex-row justify-between hover:bg-neutral-100 rounded-full"
											>
												<JobRequirementItem i={i} required={requirements} />
												<Button
													className="group-hover:flex hidden"
													onClick={() =>
														setFormData({
															...formData,
															jobRequirements: formData[
																'jobRequirements'
															].filter((item) => item != requirements),
														})
													}
												>
													<X size={16}></X>
												</Button>
											</div>
										)
									)}
								</div>
							)}
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
								value={formData.notes ?? ''}
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
									setIsEditing(false);
								}}
								className="button-icon"
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
