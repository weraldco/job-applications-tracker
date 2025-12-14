/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { CreateReminderInput, JobType, ReminderType } from '@/types/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell, Plus } from 'lucide-react';
import { useState } from 'react';
import ReminderAddModal from './reminder-add-modal';
import RemindersItem from './reminders-item';

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
		onMutate: async (newStatus) => {
			await queryClient.cancelQueries({ queryKey: ['reminder-data'] });

			const prevReminder = await queryClient.getQueryData(['reminder-data']);

			// update UI instantly
			queryClient.setQueryData<ReminderFetchType>(
				['reminder-data'],
				(old: any) => {
					if (!old) return old;
					return {
						...old,
						reminders: old.reminders.map((reminder: ReminderType) =>
							reminder.id === newStatus.id
								? { ...reminder, completed: newStatus.data.completed }
								: reminder
						),
					};
				}
			);

			return prevReminder;
		},
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
	if (error) return <p>Error fetching data</p>;
	if (!data) return;

	const handleUpdate = ({ id, data }: { id: string; data: any }) => {
		updateReminderMutation.mutate({ id, data });
	};

	const handleDelete = (id: string) => {
		deleteReminderMutation.mutate(id);
	};
	const onClose = () => {
		setIsAddReminderModalOpen(false);
	};

	return (
		<>
			<Card className=" border-0 bg-white">
				<CardHeader className="flex flex-row justify-between border-b border-neutral-200">
					<div>
						<CardTitle className="flex items-center space-x-2">
							<Bell className="h-5 w-5" />
							<span>Reminders</span>
						</CardTitle>
						<CardDescription className="text-neutral-600">
							Stay on top of your job search tasks
						</CardDescription>
					</div>
					<Button
						className="border-gray-400 border text-gray-400 hover:border-orange-primary active:border-orange-primary/80 hover:text-orange-primary duration-200"
						size="sm"
						onClick={() => setIsAddReminderModalOpen(true)}
					>
						<Plus className="h-4 w-4 mr-2" />
						Add Reminder
					</Button>
				</CardHeader>
				<CardContent className="space-y-4 ">
					<div className="space-y-3 border-0 ">
						{data.reminders.map((reminder: ReminderType) => (
							<RemindersItem
								key={reminder.id}
								reminder={reminder}
								onUpdate={handleUpdate}
								onDelete={handleDelete}
							/>
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
