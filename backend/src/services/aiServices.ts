import mammoth from 'mammoth';
import puppeteer from 'puppeteer';
import { summarizeJob } from '../lib/helper';

const { PDFParse } = require('pdf-parse');
interface PDFParseResult {
	text: string;
	numpages: number;
	// Add other properties you might need
}
// Define the interface for the expected API response data

export const aiServices = {
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
	async parseJobstreet(url: string) {
		try {
			const browser = await puppeteer.launch({
				headless: true,
				args: ['--no-sandbox', '--disable-setuid-sandbox'],
			});

			const page = await browser.newPage();

			await page.setUserAgent(
				'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115 Safari/537.36'
			);
			if (!url) return;
			await page.goto(url, { waitUntil: 'networkidle2' });

			// Title
			const title = await page.$eval(
				"h1[data-automation='job-detail-title']",
				(el) => el.textContent?.trim() || ''
			);

			// Company
			const company = await page
				.$eval(
					"span[data-automation='advertiser-name']",
					(el) => el.textContent?.trim() || ''
				)
				.catch(() => '');

			// Location
			const location = await page
				.$eval(
					"span[data-automation='job-detail-location']",
					(el) => el.textContent?.trim() || ''
				)
				.catch(() => '');

			// Full job description (JobStreet uses <div data-automation='jobDescription'>)
			const fullDescription = await page
				.$eval("div[data-automation='jobAdDetails']", (el) =>
					el.innerText.trim()
				)
				.catch(() => '');
			const summarizer = await summarizeJob(fullDescription);
			// Salary (if available)

			// Posted date
			const posted = await page
				.$eval(
					"span[data-automation='job-detail-date']",
					(el) => el.textContent?.trim() || ''
				)
				.catch(() => '');

			await browser.close();

			const result = {
				success: true,
				jobUrl: url,
				title,
				company,
				location,
				posted,
				// fullDescription,
				jobDetails: summarizer.jobDetails,
				jobRequirements: summarizer.jobRequirements,
				skillsRequired: summarizer.skillsRequired,
				experienceNeeded: summarizer.experienceNeeded,
				salary: summarizer.salary,
			};

			return result;
		} catch (error) {
			console.error('JOBSTREET SCRAPER ERROR:', error);
			return;
		}
	},
	async parseLinkedIn(url: string) {
		try {
			const browser = await puppeteer.launch({
				headless: true,
				args: ['--no-sandbox', '--disable-setuid-sandbox'],
			});

			const page = await browser.newPage();

			await page.setUserAgent(
				'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115 Safari/537.36'
			);

			await page.goto(url, { waitUntil: 'networkidle2' });

			// Title
			const title = await page.$eval(
				'h1',
				(el) => el.textContent?.trim() || ''
			);

			// Company
			const company = await page
				.$eval(
					'.topcard__org-name-link, .top-card-layout__second-subline a',
					(el) => el.textContent?.trim() || ''
				)
				.catch(() => '');

			// Location
			const location = await page
				.$eval(
					'.topcard__flavor--bullet, .top-card-layout__first-subline span',
					(el) => el.textContent?.trim() || ''
				)
				.catch(() => '');

			// ⭐ FULL JOB DESCRIPTION (Complete text)
			const fullDescription = await page
				.$eval(
					'.show-more-less-html__markup',
					(el) => el.textContent?.trim() || ''
				)
				.catch(() => '');

			const summarizer = await summarizeJob(fullDescription);
			// Posted date (optional)
			const posted = await page
				.$eval(
					'.posted-time-ago__text, .top-card-layout__third-subline span',
					(el) => el.textContent?.trim() || ''
				)
				.catch(() => '');

			await browser.close();

			const result = {
				success: true,
				jobUrl: url,
				title,
				company,
				location,
				posted,
				// description: fullDescription,
				jobDetails: summarizer.jobDetails,
				jobRequirements: summarizer.jobRequirements,
				skillsRequired: summarizer.skillsRequired,
				experienceNeeded: summarizer.experienceNeeded,
				salary: summarizer.salary,
			};
			return result;
		} catch (error) {
			console.error('SCRAPER ERROR:', error);
			return { error: 'Scrapper error' };
		}
	},
};
