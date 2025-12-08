'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Database, Bell } from 'lucide-react';

export default function ServicesSection() {
	const services = [
		{
			id: 1,
			title: 'AI-Powered Summarization',
			description:
				'Instantly summarize any job posting with our advanced AI. Extract key requirements, responsibilities, and qualifications in seconds.',
			icon: Sparkles,
			features: [
				'Extract key requirements',
				'Identify responsibilities',
				'Highlight qualifications',
				'Save time and effort',
			],
		},
		{
			id: 2,
			title: 'Complete Job Tracking',
			description:
				'Record and organize all your job applications in one place. Track status, notes, and important dates effortlessly.',
			icon: Database,
			features: [
				'Track application status',
				'Organize by company',
				'Add notes and updates',
				'View application history',
			],
		},
		{
			id: 3,
			title: 'Smart Reminders',
			description:
				'Never miss an interview or follow-up. Set reminders for important tasks, interviews, and deadlines.',
			icon: Bell,
			features: [
				'Interview reminders',
				'Follow-up notifications',
				'Deadline alerts',
				'Task management',
			],
		},
	];

	return (
		<section id="services" className="py-20 sm:py-24 lg:py-28 bg-gradient-to-br from-gray-50 to-blue-50">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<div className="text-center mb-12 sm:mb-16">
					<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
						Our Services
					</h2>
					<p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
						Everything you need to manage your job search efficiently and
						effectively.
					</p>
				</div>

				{/* Service Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
					{services.map((service) => {
						const Icon = service.icon;
						return (
							<Card
								key={service.id}
								className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
							>
								<CardHeader>
									<div className="p-4 bg-primary/10 rounded-lg w-fit mb-4">
										<Icon className="h-8 w-8 text-primary" />
									</div>
									<CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
									<CardDescription className="text-base">
										{service.description}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<ul className="space-y-3">
										{service.features.map((feature, index) => (
											<li key={index} className="flex items-start gap-2">
												<span className="text-primary mt-1">✓</span>
												<span className="text-gray-700">{feature}</span>
											</li>
										))}
									</ul>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</div>
		</section>
	);
}

