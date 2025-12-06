import { z } from 'zod';

export const RemindersSchemas = z.object({
	title: z.string().min(1, { message: 'Title is required' }),
	description: z.string().min(1, { message: 'Description is required' }),
	completed: z.boolean().optional(),
	type: z.string().min(1, { message: 'Select reminder type.' }),
	dueDate: z.string(),
	jobId: z.string().min(1, { message: 'Select Job title.' }),
});

export type RemindersSchemasType = z.infer<typeof RemindersSchemas>;
