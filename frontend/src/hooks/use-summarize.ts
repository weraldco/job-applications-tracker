import { supabase } from '@/lib/supabase';
import { useMutation } from '@tanstack/react-query';

export function useSummarizeFile() {
	return useMutation({
		mutationFn: async (formData: FormData) => {
			const { data } = await supabase.auth.getSession();
			const token = data.session?.access_token;

			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/ai/parse-file`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${token}`,
					},
					body: formData,
				}
			);

			if (!res.ok) throw new Error('File to summarize!');
			return res.json();
		},
	});
}
