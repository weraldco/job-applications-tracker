import ContactSection from '@/components/lading-page/contact-section';
import CTASection from '@/components/lading-page/cta-section';
import Footer from '@/components/lading-page/footer';
import Header from '@/components/lading-page/header';
import HeroSection from '@/components/lading-page/hero-section';
import HowToUseSection from '@/components/lading-page/how-to-use-section';
import ServicesSection from '@/components/lading-page/services-section';
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
