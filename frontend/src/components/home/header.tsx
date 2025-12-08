'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const scrollToSection = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
			setMobileMenuOpen(false);
		}
	};

	return (
		<header className="w-full sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
			<nav className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link href="/" className="flex items-center space-x-2">
						<Image
							src="/images/logo.webp"
							alt="JobStashr Logo"
							width={40}
							height={40}
							className="h-8 w-8 sm:h-10 sm:w-10"
						/>
						<span className="text-xl sm:text-2xl font-bold text-primary">
							JobStashr
						</span>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-8">
						<ul className="flex items-center space-x-6">
							<li>
								<button
									onClick={() => scrollToSection('how-to-use')}
									className="text-gray-700 hover:text-primary transition-colors"
								>
									How to Use
								</button>
							</li>
							<li>
								<button
									onClick={() => scrollToSection('services')}
									className="text-gray-700 hover:text-primary transition-colors"
								>
									Services
								</button>
							</li>
							<li>
								<button
									onClick={() => scrollToSection('contact')}
									className="text-gray-700 hover:text-primary transition-colors"
								>
									Contact Us
								</button>
							</li>
						</ul>
						<div className="flex items-center space-x-4">
							<Link href="/auth/signin">
								<Button variant="ghost" size="sm">
									Sign In
								</Button>
							</Link>
							<Link href="/auth/signup">
								<Button size="sm">Get Started</Button>
							</Link>
						</div>
					</div>

					{/* Mobile Menu Button */}
					<button
						className="md:hidden p-2"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						aria-label="Toggle menu"
					>
						{mobileMenuOpen ? (
							<X className="h-6 w-6" />
						) : (
							<Menu className="h-6 w-6" />
						)}
					</button>
				</div>

				{/* Mobile Navigation */}
				{mobileMenuOpen && (
					<div className="md:hidden py-4 border-t border-gray-200">
						<ul className="flex flex-col space-y-4">
							<li>
								<button
									onClick={() => scrollToSection('how-to-use')}
									className="text-gray-700 hover:text-primary transition-colors w-full text-left"
								>
									How to Use
								</button>
							</li>
							<li>
								<button
									onClick={() => scrollToSection('services')}
									className="text-gray-700 hover:text-primary transition-colors w-full text-left"
								>
									Services
								</button>
							</li>
							<li>
								<button
									onClick={() => scrollToSection('contact')}
									className="text-gray-700 hover:text-primary transition-colors w-full text-left"
								>
									Contact Us
								</button>
							</li>
							<li className="pt-4 border-t border-gray-200 flex flex-col space-y-2">
								<Link href="/auth/signin" className="w-full">
									<Button variant="ghost" size="sm" className="w-full">
										Sign In
									</Button>
								</Link>
								<Link href="/auth/signup" className="w-full">
									<Button size="sm" className="w-full">
										Get Started
									</Button>
								</Link>
							</li>
						</ul>
					</div>
				)}
			</nav>
		</header>
	);
};

export default Header;
