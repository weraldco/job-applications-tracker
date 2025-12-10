'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
	return (
		<section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-30 sm:py-58 lg:py-70">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="max-w-4xl mx-auto text-center ">
					{/* Badge */}
					<div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
						<Sparkles className="h-4 w-4" />
						<span>AI-Powered Job Tracking</span>
					</div>

					{/* Heading */}
					<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
						JobStashr
					</h1>

					{/* Subheading */}
					<p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
						Your smart workspace for tracking every application, interview, and
						career move.
					</p>

					{/* CTA Buttons */}
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 ">
						<Link href="/auth/signup" className="max-w-70 w-full bg-amber-50">
							<Button
								size="lg"
								variant="outline"
								className="text-lg px-8 py-4 h-auto group border-2 border-[#ff8804] hover:border-[#ff9a27] active:border-[#ec7f03] duration-200 text-[#ff8804] hover:text-[#ff9a27] active:text-orange-500 w-full"
							>
								Start Tracking Free
								<ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
							</Button>
						</Link>
						<Link href="/auth/signin" className="max-w-70 w-full group">
							<Button
								variant="outline"
								size="lg"
								className="text-lg px-8 py-4 h-auto w-full
								hover:bg-[#ff9a27] active:bg-[#ec7f03] bg-[#ff8804]  text-white  duration-200"
							>
								Sign In
							</Button>
						</Link>
					</div>

					{/* Trust indicators */}
					<p className="mt-8 text-sm text-gray-500">
						No credit card required • Free forever plan available
					</p>
				</div>
			</div>

			{/* Decorative elements */}
			<div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
				<div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
				<div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
				<div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
			</div>
		</section>
	);
}
