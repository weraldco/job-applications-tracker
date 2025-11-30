const apiKey = process.env.GEMINI_API_KEY;
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

export async function callApiWithBackoff(
	payload: any,
	retries = 5,
	delay = 1000
): Promise<any> {
	try {
		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		});

		if (response.status === 429 && retries > 0) {
			console.warn(`Rate limit exceeded. Retrying in ${delay}ms..`);
			await new Promise((res) => setTimeout(res, delay));
			return callApiWithBackoff(payload, retries - 1, delay * 2);
		}
		if (!response.ok) {
			const errorBody = await response.text();
			throw new Error(`HTTP error! status: ${response.status} - ${errorBody}`);
		}
		const result = await response.json();
		console.log('Res', result);
		return result;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`API call failed: ${error.message}`);
		} else {
			throw new Error('API call failed: Unknown error');
		}
	}
}
export async function summarizeJob(parseText: string) {
	try {
		// console.log('Extrated', extractedText);
		// ============== 3. Build Prompt for Job Extractor ==============
		const prompt = `
		        You are a job posting details extractor. Your task is to extract the key information from the provided job posting text. 
                    The output should be a JSON object with the following fields:
                    - title: The title of the job.
                    - company: The name of the company.
                    - jobDetails: A summary of the job description. Keep it concise, but include key responsibilities.
                    - jobRequirements: A summary of the candidate requirements, such as qualifications and experience.
                    - skillRequired: A list of specific skills required for the role.
                    - experienceNeeded: number of years of experience
                    - location: Location of the company, address of the company.
                    - salary: A salary of this job posting
                    Provided job posting text:
                    ${parseText}
		`;

		const payload = {
			contents: [{ role: 'user', parts: [{ text: prompt }] }],
			generationConfig: {
				// *** ADD THE HIGHER LIMIT HERE ***
				maxOutputTokens: 32768, // Setting to 32,768 (32k) is a safe bet,
				// but you can go up to the model's max (65,536 for modern flash versions).
				// **********************************
				responseMimeType: 'application/json',
				responseSchema: {
					type: 'object',
					properties: {
						title: { type: 'string' },
						company: { type: 'string' },
						jobDetails: { type: 'string' },
						jobRequirements: { type: 'array', items: { type: 'string' } },
						skillsRequired: { type: 'array', items: { type: 'string' } },
						experienceNeeded: { type: 'number' },
						location: { type: 'string' },
						salary: { type: 'number' },
					},
					// It is highly recommended to uncomment and use the 'required' array
					// required: ['title', 'company', 'jobDetails'],
				},
			},
		};

		// ============== 4. CALL GEMINI ==============
		const result = await callApiWithBackoff(payload);

		const candidate = result?.candidates?.[0];
		const candidateText = candidate?.content?.parts?.[0]?.text;
		if (!candidateText) {
			return [
				{ error: 'Structured JSON not returned by Gemini.' },
				{ status: 500 },
			];
		}

		// *** CRITICAL ERROR HANDLING ***
		if (candidate.finishReason === 'MAX_TOKENS') {
			// This handles the truncation error
			console.error('Gemini stopped due to MAX_TOKENS. Output was truncated.');
			return [
				{ error: 'Output too long. The model stopped early (MAX_TOKENS).' },
				{ status: 413 },
			];
		}
		// *** END CRITICAL ERROR HANDLING ***
		let structuredData;
		// Parse the JSON result
		try {
			// We only attempt to parse if the finishReason was NOT MAX_TOKENS
			structuredData = JSON.parse(candidateText);
		} catch (error) {
			console.error('JSON parsing error on model output:', error);
			return [
				{
					error:
						'Model returned malformed JSON, even though it finished generating.',
				},
				{ status: 500 },
			];
		}
		return structuredData;
	} catch (error: any) {
		console.error('Error:', error);
		return [{ error: error.message || 'Server error' }, { status: 500 }];
	}
}
