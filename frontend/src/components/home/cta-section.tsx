'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Rocket } from 'lucide-react';

export default function CTASection() {
	return (
		<section className="py-20 sm:py-24 lg:py-28 bg-gradient-to-r from-primary to-purple-600 text-white">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="max-w-4xl mx-auto text-center">
					<div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
						<Rocket className="h-4 w-4" />
						<span>Ready to get started?</span>
					</div>

					<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
						Start Tracking Your Job Applications Today
					</h2>

					<p className="text-lg sm:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
						Join thousands of job seekers who are using JobStashr to organize
						their job search and land their dream job.
					</p>

					<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
						<Link href="/auth/signup">
							<Button
								size="lg"
								variant="secondary"
								className="text-lg px-8 py-6 h-auto group bg-white text-primary hover:bg-gray-100"
							>
								Get Started Free
								<ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
							</Button>
						</Link>
						<Link href="/auth/signin">
							<Button
								size="lg"
								variant="outline"
								className="text-lg px-8 py-6 h-auto border-white/30 text-white hover:bg-white/10"
							>
								Sign In
							</Button>
						</Link>
					</div>

					<p className="mt-8 text-sm text-white/80">
						No credit card required • Free forever plan • Cancel anytime
					</p>
				</div>
			</div>
		</section>
	);
}

