import { z } from 'zod';

export const JobsSchema = z.object({
	title: z.string().min(1, { message: 'Title is required' }),
	company: z.string().min(1, { message: 'Company is required' }),

	applicationDate: z
		.string()
		.min(1, { message: 'Application date is required' }),

	jobUrl: z.string().optional(),
	location: z.string().optional(),
	salary: z.number().optional(),
	experienceNeeded: z.number(),
	jobDetails: z.string().min(1, { message: 'Job Details is required' }),
	skillsRequired: z.array(z.string().min(1, { message: 'Skills' })),
	jobRequirements: z.array(z.string().min(1, { message: 'Required' })),
	notes: z.string().optional(),
});

export type JobsSchemaType = z.infer<typeof JobsSchema>;
