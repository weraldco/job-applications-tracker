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
				...options?.headers,
			},
		});

		if (!res.ok) throw new Error(`Error: ${res.status}`);

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
