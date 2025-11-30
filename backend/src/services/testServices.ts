// backend/src/services/testServices.ts

import fs from 'fs';
import path from 'path';

const { PDFParse } = require('pdf-parse');
interface PDFParseResult {
	text: string;
	numpages: number;
	// Add other properties you might need
}
export const testServices = {
	async parsePdfFromPath(fileName: string) {
		try {
			const filePath = path.resolve(process.cwd(), fileName);
			if (!fs.existsSync(filePath)) {
				throw new Error(`File not found: ${filePath}`);
			}
			// This now calls the actual function, not the module object.
			const parser = await new PDFParse({ url: filePath });

			const result = await parser.getText();
			return result;
		} catch (error) {
			console.error('PDF Parse Error:', error);
			throw new Error('Failed to parse PDF');
		}
	},
	async parsePdfFromBuffer(pdfBuffer: Buffer): Promise<string> {
		try {
			// 1. Validate the input Buffer
			if (!pdfBuffer || pdfBuffer.length === 0) {
				throw new Error('Input Buffer is empty or invalid.');
			}

			// 2. Pass the Buffer directly to the pdf-parse function.
			//    pdf-parse accepts a Buffer, eliminating the need for file I/O (fs.existsSync, path.resolve).
			const data: PDFParseResult = await new PDFParse(pdfBuffer);

			// 3. Return the extracted text
			return data.text;
		} catch (error) {
			console.error('PDF Parse Error:', error);
			// Re-throw a generic error to the caller
			throw new Error('Failed to parse PDF content from Buffer.');
		}
	},
};
