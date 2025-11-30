import fs from 'fs';
import mammoth from 'mammoth';
import path from 'path';

const { PDFParse } = require('pdf-parse');
interface PDFParseResult {
	text: string;
	numpages: number;
	// Add other properties you might need
}
// Define the interface for the expected API response data

export const aiServices = {
	// parse the description
	parseDescription() {},
	async parseDocx(docxBuffer: Buffer) {
		if (!docxBuffer || docxBuffer.length === 0) {
			throw new Error('DOCX buffer is empty.');
		}
		try {
			const result = await mammoth.extractRawText({ buffer: docxBuffer });

			return result.value;
		} catch (error) {
			console.error('DOCX Parse Error:', error);
			throw new Error('Failed to parse DOCX');
		}
	},
	async parsePdf(pdfBuffer: Buffer): Promise<string> {
		try {
			// 1. Validate the input Buffer
			if (!pdfBuffer || pdfBuffer.length === 0) {
				throw new Error('Input Buffer is empty or invalid.');
			}

			const parser = new PDFParse({ data: pdfBuffer });
			const result = await parser.getText();
			return result.text;
		} catch (error) {
			console.error('PDF Parse Error:', error);
			// Re-throw a generic error to the caller
			throw new Error('Failed to parse PDF content from Buffer.');
		}
	},
};
