'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { FileText, Link as LinkIcon, Upload } from 'lucide-react';
import SectionTitle from './section-title';
import TitleTag from './title-tag';

export default function HowToUseSection() {
	const demos = [
		{
			id: 1,
			title: 'Job Description',
			description:
				'Simply paste the job description text and let our AI extract all the key information automatically.',
			icon: FileText,
			steps: [
				'Copy the job posting text',
				'Paste it into JobStashr',
				'Get instant AI-powered summary',
			],
		},
		{
			id: 2,
			title: 'Job URL',
			description:
				"Enter the job posting URL and we'll fetch and summarize the entire job description for you.",
			icon: LinkIcon,
			steps: [
				'Copy the job posting URL',
				'Paste the link into JobStashr',
				'Watch as we extract and summarize',
			],
		},
		{
			id: 3,
			title: 'Job File',
			description:
				"Upload your job posting as a PDF or DOCX file, and we'll extract and summarize everything automatically.",
			icon: Upload,
			steps: [
				'Upload PDF or DOCX file',
				'Our AI processes the document',
				'Get a complete summary instantly',
			],
		},
	];

	return (
		<section id="how-to-use" className="py-20 sm:py-24 lg:py-28 bg-white">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<SectionTitle
					tagTitle="HOW TO USE"
					title="Track Your Applications with Simple Ways"
					description="Three simple ways to summarize any job posting with AI. Choose the
						method that works best for you."
				/>

				{/* Demo Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
					{demos.map((demo) => {
						const Icon = demo.icon;
						return (
							<Card
								key={demo.id}
								className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary/50"
							>
								<CardHeader>
									<div className="flex items-center gap-3 mb-2">
										<div className="p-3 bg-primary/10 rounded-lg">
											<Icon className="h-6 w-6 text-primary" />
										</div>
										<CardTitle className="text-xl">{demo.title}</CardTitle>
									</div>
									<CardDescription className="text-base">
										{demo.description}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<ul className="space-y-2">
										{demo.steps.map((step, index) => (
											<li key={index} className="flex items-start gap-2">
												<span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center mt-0.5">
													{index + 1}
												</span>
												<span className="text-gray-600">{step}</span>
											</li>
										))}
									</ul>
								</CardContent>
							</Card>
						);
					})}
				</div>

				{/* Demo Placeholder */}
				<div className="mt-12 sm:mt-16 max-w-4xl mx-auto">
					<Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300">
						<CardContent className="p-8 sm:p-12 text-center">
							<div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-4">
								<p className="text-gray-500 text-sm sm:text-base">
									Demo Video/GIF Placeholder
								</p>
							</div>
							<p className="text-sm text-gray-600">
								Watch how easy it is to summarize job postings with JobStashr
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
}
