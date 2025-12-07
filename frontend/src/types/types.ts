export interface FormDataT {
	id?: string;
	title: string;
	company: string;
	applicationDate: Date;
	jobUrl: string;
	skillsRequired: string[];
	jobRequirements: string[];
	experienceNeeded: string;
	notes: string;
	salary: string;
	location: string;
}
export type JobStatus =
	| 'APPLIED'
	| 'INTERVIEWING'
	| 'OFFER'
	| 'REJECTED'
	| 'WITHDRAWN';

export interface JobType {
	id: string;
	title: string;
	company: string;
	applicationDate: Date;
	status: 'APPLIED' | 'INTERVIEWING' | 'OFFER' | 'REJECTED' | 'WITHDRAWN';
	jobUrl: string | null;
	jobDetails: string;
	skillsRequired: string;
	jobRequirements: string;
	experienceNeeded: number | null;
	notes: string | null;
	salary: number | null;
	location: string | null;
	userId: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface ReminderType {
	id: string;
	title: string;
	description: string | null;
	dueDate: Date;
	completed: boolean;
	type:
		| 'FOLLOW_UP'
		| 'INTERVIEW_PREP'
		| 'THANK_YOU_NOTE'
		| 'APPLICATION_DEADLINE'
		| 'OTHER';
	userId: string;
	jobId: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface JobInputData {
	title: string;
	company: string;
	jobUrl?: string;
	applicationDate: Date;
	jobDetails: string;
	skillsRequired: string[];
	jobRequirements: string[];
	experienceNeeded: number | null;
	notes?: string;
	location?: string;
	salary?: number;
}
export type CreateReminderInput = {
	title: string;
	description: string;
	dueDate: string | null;
	completed: boolean;
	type:
		| 'FOLLOW_UP'
		| 'INTERVIEW_PREP'
		| 'THANK_YOU_NOTE'
		| 'APPLICATION_DEADLINE'
		| 'OTHER';
	jobId: string;
};

export type ReminderStatusType =
	| 'FOLLOW_UP'
	| 'INTERVIEW_PREP'
	| 'THANK_YOU_NOTE'
	| 'APPLICATION_DEADLINE'
	| 'OTHER';
