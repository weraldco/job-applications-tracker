'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function PdfUploader() {
	const [file, setFile] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);
	const [text, setText] = useState<string>('');

	const handleUpload = async () => {
		if (!file) return;

		setLoading(true);

		const formData = new FormData();
		formData.append('pdf', file);

		try {
			const res = await fetch('/api/parse-pdf', {
				method: 'POST',
				body: formData,
			});

			const data = await res.json();
			setText(data.text || 'No text found.');
		} catch (err) {
			console.error(err);
			setText('Error parsing PDF');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col gap-4 w-full max-w-md">
			<Input
				type="file"
				accept="application/pdf"
				onChange={(e) => setFile(e.target.files?.[0] || null)}
			/>
			<Button onClick={handleUpload} disabled={!file || loading}>
				{loading ? 'Parsing...' : 'Upload & Parse PDF'}
			</Button>

			{text && (
				<div className="mt-4 p-2 border rounded bg-gray-50">
					<h3 className="font-semibold mb-2">Extracted Text:</h3>
					<pre className="whitespace-pre-wrap">{text}</pre>
				</div>
			)}
		</div>
	);
}
