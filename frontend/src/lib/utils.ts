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
	const { data } = await supabase.auth.getSession();
	const access_token = data.session?.access_token;

	if (!access_token) throw new Error('No session found');
	const res = await fetch(url, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`,
			...options?.headers,
		},
	});

	if (!res.ok) throw new Error(`Error: ${res.status}`);

	return res.json();
}

export const localDateFromInput = (input: string) => {
	// "2025-11-24T13:00"
	const [datePart, timePart] = input.split('T');
	const [year, month, day] = datePart.split('-').map(Number);
	const [hour, minute] = timePart.split(':').map(Number);

	return new Date(year, month - 1, day, hour, minute);
};
