/* eslint-disable @typescript-eslint/no-unused-vars */

import { ReminderType } from '@prisma/client';

import UseEscClose from '@/hooks/use-esc-close';
import { CreateReminderInput, JobType } from '@/types/types';
import { Loader2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

// Import the zod schemas, zod revolver, useForm
import {
	RemindersSchemas,
	RemindersSchemasType,
} from '@/schemas/reminders.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

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
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<RemindersSchemasType>({
		resolver: zodResolver(RemindersSchemas),
		defaultValues: {
			title: '',
			description: '',
			dueDate: new Date().toISOString().split('T')[0],
			completed: false,
			type: '',
			jobId: '',
		},
	});

	const jobSelections = [
		...(data?.map((d) => ({ id: d.id, title: d.title })) ?? []),
	];

	const typeMap: Record<string, ReminderType> = {
		'Interview Prep': 'INTERVIEW_PREP',
		Deadline: 'APPLICATION_DEADLINE',
		'Follow up': 'FOLLOW_UP',
		'Thank you note': 'THANK_YOU_NOTE',
		Other: 'OTHER',
	};

	if (!data) {
		<p>Invalid data!</p>;
		return;
	}

	const onSubmit = (data: RemindersSchemasType) => {
		const newReminderData = {
			...data,
			dueDate: new Date(String(data.dueDate)).toISOString(),
			jobId: data.jobId,
			completed: false,
			type: typeMap[data.type],
		};
		onReminderAdded(newReminderData);
		toast.success('Success', {
			description: 'Reminder added successfully!',
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
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<h2 className="text-xl font-semibold">Adding New Reminder</h2>
						<CardDescription>
							Add your reminder to be more organize your job applications.
						</CardDescription>
					</div>
					<button onClick={handleClose}>
						<X />
					</button>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						<div className="space-y-3">
							<Label
								htmlFor="title"
								className="text-sm font-medium text-gray-700"
							>
								Reminder For what Job Posting *
							</Label>
							<div className="relative">
								<select
									{...register('jobId')}
									className="text-sm border rounded px-2 py-1 bg-white cursor-pointer w-full"
									onClick={(e) => e.stopPropagation()}
									defaultValue=""
								>
									<option value="" disabled>
										Choose a job title..
									</option>

									{jobSelections.map((d, i) => (
										<option key={i} value={d.id}>
											{d.title}
										</option>
									))}
								</select>
							</div>
							{errors.jobId && (
								<p className="text-red-500">{errors.jobId.message}</p>
							)}
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
								className="mt-1"
								placeholder="Enter your reminder title.."
								{...register('title')}
							/>
							{errors.title && (
								<p className="text-red-500">{errors.title.message}</p>
							)}
						</div>
						<div className="space-y-3">
							<Label
								htmlFor="description"
								className="text-sm font-medium text-gray-700"
							>
								Reminder Description *
							</Label>
							<Textarea
								id="description"
								rows={3}
								className="mt-1"
								placeholder="Enter your reminder description.."
								{...register('description')}
							/>
							{errors.description && (
								<p className="text-red-500">{errors.description.message}</p>
							)}
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
										{...register('type')}
										className="text-sm border rounded px-2 py-1 bg-white cursor-pointer"
										onClick={(e) => e.stopPropagation()}
									>
										<option value="">Choose a type of reminder</option>
										{Object.entries(typeMap).map(([key, val]) => (
											<option key={key} value={key}>
												{key}
											</option>
										))}
									</select>
								</div>
								{errors.type && (
									<p className="text-red-500">{errors.type.message}</p>
								)}
							</div>
							<div className="space-y-3">
								<Label
									htmlFor="title"
									className="text-sm font-medium text-gray-700"
								>
									Reminder Due *
								</Label>
								<div>
									<input type="datetime-local" {...register('dueDate')} />
									{errors.dueDate && (
										<p className="text-red-500">{errors.dueDate.message}</p>
									)}
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
