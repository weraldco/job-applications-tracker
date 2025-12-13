import ContactSection from '@/components/home/contact-section';
import CTASection from '@/components/home/cta-section';
import Footer from '@/components/home/footer';
import Header from '@/components/home/header';
import HeroSection from '@/components/home/hero-section';
import HowToUseSection from '@/components/home/how-to-use-section';
import ServicesSection from '@/components/home/services-section';
import { Suspense } from 'react';

export default function LandingPage() {
	return (
		<Suspense fallback={<p>Verifying users..</p>}>
			<div className="min-h-screen">
				<Header />
				<main>
					<HeroSection />
					<HowToUseSection />
					<ServicesSection />
					<CTASection />
					<ContactSection />
				</main>
				<Footer />
			</div>
		</Suspense>
	);
}
