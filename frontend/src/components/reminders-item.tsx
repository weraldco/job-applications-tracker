/* eslint-disable @typescript-eslint/no-explicit-any */
import { getTypeColor, getTypeLabel } from '@/lib/utils';
import { ReminderType } from '@/types/types';
import { format } from 'date-fns';
import { CheckCircle, Clock, Trash2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

const RemindersItem = ({
	reminder,
	onUpdate,
	onDelete,
}: {
	reminder: ReminderType;
	onUpdate: ({ id, data }: { id: string; data: any }) => void;
	onDelete: (id: string) => void;
}) => {
	return (
		<div
			className={`p-3 border border-neutral-300 rounded-lg ${
				reminder.completed ? 'bg-gray-50 opacity-60' : 'bg-white'
			}`}
		>
			<div className="flex items-start justify-between">
				<div className="flex flex-1 flex-col gap-2">
					{/* Reminder Header */}
					<div className="flex items-center space-x-2 mb-1 flex-row justify-between">
						<h4
							className={`font-medium text-lg ${
								reminder.completed ? 'line-through' : ''
							}`}
						>
							{reminder.title}
						</h4>
						<div className="flex flex-row justify-between items-center gap-4">
							<Badge
								className={`${getTypeColor(
									reminder.type
								)} text-center hidden md:flex`}
							>
								{getTypeLabel(reminder.type).toUpperCase()}
							</Badge>
							<div className="flex gap-2 ">
								{reminder.completed ? (
									<Button
										variant="outline"
										size="sm"
										className=" border-green-1"
										onClick={() =>
											onUpdate({
												id: reminder.id,
												data: {
													completed: reminder.completed ? false : true,
												},
											})
										}
									>
										<CheckCircle className=" text-green-1" size={16} />
									</Button>
								) : (
									<Button
										size="sm"
										className="secondary-btn"
										onClick={() =>
											onUpdate({
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
									className="secondary-btn"
									size="sm"
									onClick={() => {
										if (
											confirm('Are you sure you want to delete this reminder?')
										) {
											onDelete(reminder.id);
										}
									}}
								>
									<Trash2 size={16}></Trash2>
								</Button>
							</div>
						</div>
					</div>
					{/* Reminder Content */}
					<div className="flex items-start md:hidden">
						<Badge className={`${getTypeColor(reminder.type)} text-center `}>
							{getTypeLabel(reminder.type).toUpperCase()}
						</Badge>
					</div>
					<p className="text-sm text-gray-600 mb-2">{reminder.description}</p>
					<div className="flex items-center space-x-1 text-xs text-gray-500">
						<Clock className="h-3 w-3" />
						<span>{format(reminder.dueDate, 'MMM dd, yyyy - hh:mm')}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RemindersItem;
