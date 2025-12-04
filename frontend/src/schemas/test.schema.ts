import * as z from 'zod';

// 1. Define the schema
export const loginSchema = z.object({
	email: z.string().min(1, { message: 'Email is required' }),
	username: z.string().min(1, { message: 'Username is required' }),
	password: z.string().min(1, { message: 'Password is required' }),
});

// 2. Infer the TypeScript type from the schema
export type LoginFormInputs = z.infer<typeof loginSchema>;
