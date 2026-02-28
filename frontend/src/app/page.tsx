
import { AnimateOnScroll } from '@/components/lading-page/animate-on-scroll';
import { Features } from '@/components/lading-page/features';
import { FinalCTA } from '@/components/lading-page/final-cta';
import { Footer } from '@/components/lading-page/footer';
import { Header } from '@/components/lading-page/header';
import { Hero } from '@/components/lading-page/hero';
import { HowItWorks } from '@/components/lading-page/how-it-works';
import { ProblemSection } from '@/components/lading-page/problem-section';
import { Suspense } from 'react';

export default function LandingPage() {
	return (
		<Suspense fallback={<p>Verifying users..</p>}>
			<div>
				<Header />
				<Hero />
				<AnimateOnScroll>
					<ProblemSection />
				</AnimateOnScroll>
				<AnimateOnScroll>
					<HowItWorks />
				</AnimateOnScroll>
				<AnimateOnScroll>
					<Features />
				</AnimateOnScroll>
				<AnimateOnScroll>
					<FinalCTA />
				</AnimateOnScroll>
				<Footer />
			</div>
		</Suspense>
	);
}
