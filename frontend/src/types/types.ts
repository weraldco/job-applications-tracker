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

export interface JobType {
	id: string;
	title: string;
	company: string;
	applicationDate: Date;
	status: 'APPLIED' | 'INTERVIEWING' | 'OFFER' | 'REJECTED' | 'WITHDRAWN';
	jobUrl: string | null;
	skillsRequired: string;
	jobRequirements: string;
	experienceNeeded: number | null;
	notes: string | null;
	salary: string | null;
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
