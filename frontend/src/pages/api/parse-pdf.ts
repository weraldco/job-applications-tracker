/* eslint-disable @typescript-eslint/no-explicit-any */
export const config = { api: { bodyParser: false } };
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== 'POST') return res.status(405).end();

	try {
		// ✅ dynamic import (ESM-safe)
		const pdfModule = await import('pdf-parse');
		const parsePDF = ((pdfModule as any).default ?? pdfModule) as (
			buffer: Buffer
		) => Promise<any>;

		const buffers: Uint8Array[] = [];
		for await (const chunk of req) buffers.push(chunk);
		const buffer = Buffer.concat(buffers);

		const data = await parsePDF(buffer);
		res.status(200).json({ text: data.text, numPages: data.numpages });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to parse PDF' });
	}
}
