/* eslint-disable @typescript-eslint/no-unused-vars */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { supabase } from './supabase';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function fetcher<T>(
	url: string,
	options?: RequestInit
): Promise<T> {
	if (!navigator.onLine) {
		throw new Error('No internet connection. Please check your network.');
	}

	const { data } = await supabase.auth.getSession();
	const access_token = data.session?.access_token;

	if (!access_token) throw new Error('No session found');

	const isFormData = options?.body instanceof FormData;
	try {
		const res = await fetch(url, {
			...options,
			headers: {
				...(isFormData ? {} : { 'Content-Type': 'application/json' }),
				Authorization: `Bearer ${access_token}`,
				...(options?.headers || {}),
			},
		});

		if (!res.ok) {
			let errorMessage = `Error: ${res.status}`;
			try {
				const errorData = await res.json();
				if (errorData?.error) errorMessage = errorData.error;
			} catch {}
			throw new Error(errorMessage);
		}
		return res.json();
	} catch (error) {
		if (error instanceof TypeError && error.message === 'Failed to fetch!') {
			throw new Error('Network error: Please check your internet connections');
		}
		throw error;
	}
}

export const localDateFromInput = (input: string) => {
	// "2025-11-24T13:00"
	const [datePart, timePart] = input.split('T');
	const [year, month, day] = datePart.split('-').map(Number);
	const [hour, minute] = timePart.split(':').map(Number);

	return new Date(year, month - 1, day, hour, minute);
};

export function checkNetwork(): boolean {
	if (!navigator.onLine) {
		console.log('Error net');
		return false;
	}
	return true;
}

export const urlConstructor = (url: string) => {
	let urlResult = '';
	let type = '';
	let error = '';
	try {
		// Decode URL in case it's encoded
		const decodedUrl = decodeURIComponent(url.trim());

		// This regex extracts a 10-digit job ID from any LinkedIn job URL
		const linkedInMatch = decodedUrl.match(/\/jobs\/view\/(\d{10})/);
		const linkedInParamMatch = decodedUrl.match(/currentJobId=(\d{10})/);

		if (linkedInMatch) {
			urlResult = `https://www.linkedin.com/jobs/view/${linkedInMatch[1]}`;
			type = 'linkedin';
		}

		// Some LinkedIn share URLs use "currentJobId="
		else if (linkedInParamMatch) {
			urlResult = `https://www.linkedin.com/jobs/view/${linkedInParamMatch[1]}`;
			type = 'linkedin';
		}

		const jobstreetParamMatch = decodedUrl.match(/jobId=(\d{8})/);
		const jobStreetMatch = decodedUrl.match(/\job\/(\d{8})/);

		if (jobStreetMatch) {
			urlResult = `https://ph.jobstreet.com/job/${jobStreetMatch[1]}`;
			type = 'jobstreet';
		} else if (jobstreetParamMatch) {
			urlResult = `https://ph.jobstreet.com/job/${jobstreetParamMatch[1]}`;
			type = 'linkedin';
		}

		if (!urlResult) {
			error = 'No valid job url or invalid found!';
		}
	} catch (err) {
		error = 'Invalid Url!';
	}
	return { urlResult, type, error };
};

export const getTypeColor = (type: string) => {
	switch (type) {
		case 'FOLLOW_UP':
			return 'bg-blue-1 text-white';
		case 'INTERVIEW_PREP':
			return 'bg-yellow-1/80 text-white';
		case 'APPLICATION_DEADLINE':
			return 'bg-red-1 text-white';
		default:
			return 'bg-gray-1 text-white';
	}
};

export const getTypeLabel = (type: string) => {
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
