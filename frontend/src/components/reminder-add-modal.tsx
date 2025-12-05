/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReminderType } from '@prisma/client';

import UseEscClose from '@/hooks/use-esc-close';
import { CreateReminderInput, JobType } from '@/types/types';
import { Loader2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
interface ReminderT {
	isOpen: boolean;
	data: JobType[] | undefined;
	onClose: () => void;
	onReminderAdded: (data: CreateReminderInput) => void;
}

const ReminderAddModal = ({
	isOpen,
	data,
	onClose,
	onReminderAdded,
}: ReminderT) => {
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		dueDate: new Date().toISOString().split('T')[0],
		completed: false,
		type: '',
		jobId: '',
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [reminderType, setReminderType] = useState<string>('Interview Prep');
	const [jobTitle, setJobTitle] = useState<any | null>(null);

	const jobSelections = [
		...(data?.map((d) => ({ id: d.id, title: d.title })) ?? []),
	];

	useEffect(() => {
		setJobTitle(jobSelections[0]);
	}, []);

	const [dueDate, setDueDate] = useState<string | null>(null);
	const typeMap: Record<string, ReminderType> = {
		'Interview Prep': 'INTERVIEW_PREP',
		Deadline: 'APPLICATION_DEADLINE',
		'Follow up': 'FOLLOW_UP',
		'Thank you note': 'THANK_YOU_NOTE',
		Other: 'OTHER',
	};

	const handleReminderTypeChange = (reminder: string) => {
		setReminderType(reminder as ReminderType);
	};

	if (!data) {
		<p>Invalid data!</p>;
		return;
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// setIsSubmitting(true);
		// try {
		// 	const newReminder: CreateReminderInput = {
		// 		title: formData.title,
		// 		description: formData.description,
		// 		dueDate: new Date(String(dueDate)).toISOString(),
		// 		completed: formData.completed,
		// 		type:
		// 			reminderType === undefined
		// 				? 'INTERVIEW_PREP'
		// 				: typeMap[reminderType as string],
		// 		jobId: jobTitle.id,
		// 	};

		// 	onReminderAdded(newReminder);
		// 	toast.success('Success', {
		// 		description: 'Reminder added successfully!',
		// 	});

		// 	formData['title'] = '';
		// 	formData['description'] = '';
		// 	formData['dueDate'] = '';
		// 	formData['completed'] = false;
		// 	formData['type'] = '';
		// 	formData['jobId'] = '';

		// 	onClose();
		// } catch (error) {
		// 	toast.error('Error', {
		// 		description: 'Failed to add new reminder',
		// 	});
		// } finally {
		// 	setIsSubmitting(false);
		// }
		console.log('test');
	};

	const handleClose = () => {
		onClose();
		setFormData({
			title: '',
			description: '',
			dueDate: new Date().toISOString().split('T')[0],
			completed: false,
			type: '',
			jobId: '',
		});
	};

	UseEscClose(handleClose);
	if (!isOpen) return null;
	return (
		<div className="fixed inset-0 bg-neutral-700/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
			<Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
				<CardHeader className="flex flex-row items-center justify-between">
					<h2 className="text-xl">Adding New Reminder</h2>
					<button onClick={handleClose}>
						<X />
					</button>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-3">
							<Label
								htmlFor="title"
								className="text-sm font-medium text-gray-700"
							>
								Reminder For what Job Posting *
							</Label>
							<div className="relative">
								<select
									value={jobTitle ? jobTitle : 'Choose a job title..'}
									onChange={(e) => setJobTitle(e.target.value)}
									className="text-sm border rounded px-2 py-1 bg-white cursor-pointer w-full"
									onClick={(e) => e.stopPropagation()}
								>
									{jobSelections.map((d, i) => (
										<option key={i} value={d.id}>
											{d.title}
										</option>
									))}
								</select>
							</div>
						</div>
						<div className="space-y-3">
							<Label
								htmlFor="title"
								className="text-sm font-medium text-gray-700"
							>
								Reminder Title *
							</Label>
							<Input
								id="title"
								value={formData.title}
								onChange={(e) =>
									setFormData({ ...formData, title: e.target.value })
								}
								required
								className="mt-1"
								placeholder="Enter your reminder title.."
							/>
						</div>
						<div className="space-y-3">
							<Label
								htmlFor="title"
								className="text-sm font-medium text-gray-700"
							>
								Reminder Description *
							</Label>
							<Textarea
								id="skillsRequired"
								value={formData.description}
								onChange={(e) =>
									setFormData({ ...formData, description: e.target.value })
								}
								rows={3}
								className="mt-1"
								placeholder="Enter your reminder description.."
							/>
						</div>
						<div className="flex flex-row items-center gap-20">
							<div className="space-y-3">
								<Label
									htmlFor="title"
									className="text-sm font-medium text-gray-700"
								>
									Reminder Type *
								</Label>
								<div className="relative">
									<select
										value={reminderType ? reminderType : ''}
										onChange={(e) => handleReminderTypeChange(e.target.value)}
										className="text-sm border rounded px-2 py-1 bg-white cursor-pointer"
										onClick={(e) => e.stopPropagation()}
									>
										{Object.entries(typeMap).map(([key, val]) => (
											<option key={key} value={key}>
												{key}
											</option>
										))}
									</select>
								</div>
							</div>
							<div className="space-y-3">
								<Label
									htmlFor="title"
									className="text-sm font-medium text-gray-700"
								>
									Reminder Due *
								</Label>
								<div>
									<input
										type="datetime-local"
										value={dueDate ?? ''}
										onChange={(e) => setDueDate(e.target.value)}
									></input>
								</div>
							</div>
						</div>
						<div className=" flex flex-row gap-4">
							<Button
								type="submit"
								disabled={isSubmitting}
								className="flex-1 bg-blue-500 hover:bg-blue-400 acrive:bg-blue-600 duration-200 text-white"
							>
								{isSubmitting ? (
									<>
										<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										Adding...
									</>
								) : (
									'Add new reminder'
								)}
							</Button>
							<button
								className="bg-blue-500 hover:bg-blue-400 acrive:bg-blue-600 duration-200 text-white px-4 py-1 rounded"
								type="button"
								onClick={handleClose}
							>
								Cancel
							</button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default ReminderAddModal;
