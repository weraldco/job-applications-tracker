'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { fetcher } from '@/lib/utils';
// import { Job, Reminder, ReminderType } from '@prisma/client';
import { CreateReminderInput, JobType, ReminderType } from '@/types/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Bell, CheckCircle, Clock, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ReminderAddModal from './reminder-add-modal';

export type ReminderFetchType = {
	message: string;
	reminders: ReminderType[];
};
export function RemindersPanel({ jobs }: { jobs: JobType[] | undefined }) {
	const [isAddReminderModalOpen, setIsAddReminderModalOpen] = useState(false);
	const queryClient = useQueryClient();

	// Add new Reminder
	const addReminderMutation = useMutation({
		mutationFn: (reminder: CreateReminderInput) =>
			fetcher(`${process.env.NEXT_PUBLIC_API_URL}/reminders/create`, {
				method: 'POST',
				body: JSON.stringify(reminder),
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['reminder-data'] });
		},
	});
	const updateReminderMutation = useMutation({
		mutationFn: async (payload: { id: string; data: { completed: boolean } }) =>
			fetcher(`${process.env.NEXT_PUBLIC_API_URL}/reminders/${payload.id}`, {
				method: 'PATCH',
				body: JSON.stringify(payload.data),
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['reminder-data'] });
		},
	});

	const deleteReminderMutation = useMutation({
		mutationFn: (id: string) =>
			fetcher(`${process.env.NEXT_PUBLIC_API_URL}/reminders/${id}`, {
				method: 'DELETE',
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['reminder-data'] });
		},
		onError: (err) => {
			console.error(err);
		},
	});

	const { data, isLoading, error } = useQuery<ReminderFetchType>({
		queryKey: ['reminder-data'],
		queryFn: () => fetcher(`${process.env.NEXT_PUBLIC_API_URL}/reminders`),
	});

	// Mock data for demo
	if (isLoading) return <p>Loading..</p>;
	if (error) return <p>Error</p>;
	if (!data) return <p>Error fetching reminder datas</p>;
	console.log('Reminder data', data);
	console.log('job', jobs);

	const getTypeColor = (type: string) => {
		switch (type) {
			case 'FOLLOW_UP':
				return 'bg-blue-100 text-blue-800';
			case 'INTERVIEW_PREP':
				return 'bg-yellow-100 text-yellow-800';
			case 'APPLICATION_DEADLINE':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const getTypeLabel = (type: string) => {
		switch (type) {
			case 'FOLLOW_UP':
				return 'Follow Up';
			case 'INTERVIEW_PREP':
				return 'Interview Prep';
			case 'APPLICATION_DEADLINE':
				return 'Deadline';
			default:
				return type;
		}
	};

	const onClose = () => {
		setIsAddReminderModalOpen(false);
	};

	return (
		<>
			<Card className="">
				<CardHeader>
					<CardTitle className="flex items-center space-x-2">
						<Bell className="h-5 w-5" />
						<span>Reminders</span>
					</CardTitle>
					<CardDescription>
						Stay on top of your job search tasks
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<Button
						className="w-full button-icon"
						size="sm"
						onClick={() => setIsAddReminderModalOpen(true)}
					>
						<Plus className="h-4 w-4 mr-2" />
						Add Reminder
					</Button>

					<div className="space-y-3">
						{data.reminders.map((reminder: ReminderType) => (
							<div
								key={reminder.id}
								className={`p-3 border rounded-lg ${
									reminder.completed ? 'bg-gray-50 opacity-60' : 'bg-white'
								}`}
							>
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<div className="flex items-center space-x-2 mb-1">
											<h4
												className={`font-medium ${
													reminder.completed ? 'line-through' : ''
												}`}
											>
												{reminder.title}
											</h4>
											<Badge className={getTypeColor(reminder.type)}>
												{getTypeLabel(reminder.type)}
											</Badge>
										</div>
										<p className="text-sm text-gray-600 mb-2">
											{reminder.description}
										</p>
										<div className="flex items-center space-x-1 text-xs text-gray-500">
											<Clock className="h-3 w-3" />
											<span>
												{format(reminder.dueDate, 'MMM dd, yyyy - hh:mm')}
											</span>
										</div>
									</div>
									<div className="flex gap-2">
										{reminder.completed ? (
											<Button
												variant="outline"
												className=" p-2 border-neutral-900"
												onClick={() =>
													updateReminderMutation.mutate({
														id: reminder.id,
														data: {
															completed: reminder.completed ? false : true,
														},
													})
												}
											>
												<CheckCircle className=" text-green-500" size={16} />
											</Button>
										) : (
											<Button
												className="p-2 secondary-btn"
												onClick={() =>
													updateReminderMutation.mutate({
														id: reminder.id,
														data: {
															completed: reminder.completed ? false : true,
														},
													})
												}
											>
												<CheckCircle size={16} />
											</Button>
										)}
										<Button
											className="p-2 secondary-btn"
											onClick={() => {
												if (
													confirm(
														'Are you sure you want to delete this reminder?'
													)
												) {
													deleteReminderMutation.mutate(reminder.id);
												}
											}}
										>
											<Trash2 size={16}></Trash2>
										</Button>
									</div>
								</div>
							</div>
						))}
					</div>

					{data.reminders.length === 0 && (
						<div className="text-center py-6 text-gray-500">
							<Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
							<p>No reminders yet</p>
							<p className="text-sm">Add reminders to stay organized</p>
						</div>
					)}
				</CardContent>
			</Card>
			<ReminderAddModal
				isOpen={isAddReminderModalOpen}
				data={jobs}
				onClose={onClose}
				onReminderAdded={addReminderMutation.mutate}
			/>
		</>
	);
}
