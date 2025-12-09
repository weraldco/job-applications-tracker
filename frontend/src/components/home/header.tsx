'use client';

import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

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
		<header className="w-full sticky top-0 z-50 bg-white/20 backdrop-blur-sm  p-4">
			<nav className="container mx-auto sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link href="/" className="flex items-center space-x-2">
						<Image
							src="/images/logo.webp"
							alt="JobStashr Logo"
							width={200}
							height={200}
						/>
						{/* <span className="text-xl sm:text-2xl font-bold text-primary">
							JobStashr
						</span> */}
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden lg:flex items-center space-x-8">
						<ul className="flex items-center space-x-6">
							<li>
								<button
									onClick={() => scrollToSection('how-to-use')}
									className="nav-menu"
								>
									How to Use
								</button>
							</li>
							<li>
								<button
									onClick={() => scrollToSection('services')}
									className="nav-menu"
								>
									Services
								</button>
							</li>
							<li>
								<button
									onClick={() => scrollToSection('contact')}
									className="nav-menu"
								>
									Contact Us
								</button>
							</li>
						</ul>
						<div className="flex items-center space-x-4">
							<Link href="/auth/signin" className="">
								<Button
									className="border-orage-400 rounded-full border-2  hover:border-orange-300 active:border-orange-500 duration-200 text-orange-400 hover:text-orange-300 active:text-orange-500"
									variant="outline"
								>
									Sign in
								</Button>
							</Link>
							<Link
								href="/auth/signup"
								className="hover:bg-orange-300 active:bg-orange-500 bg-orange-400 duration-200 text-neutral-50 rounded-full px-4 py-1"
							>
								<Button>Get Started</Button>
							</Link>
						</div>
					</div>

					{/* Mobile Menu Button */}
					<button
						className="lg:hidden p-2"
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
					<div className="lg:hidden py-4 border-t border-gray-200 ">
						<ul className="flex flex-col space-y-2">
							<li className="hover:bg-neutral-200/50  py-4 px-4 duration-200">
								<button
									onClick={() => scrollToSection('how-to-use')}
									className="text-gray-700 hover:text-primary transition-colors w-full text-left "
								>
									How to Use
								</button>
							</li>
							<li className="hover:bg-neutral-200/50  py-4 px-4 duration-200">
								<button
									onClick={() => scrollToSection('services')}
									className="text-gray-700 hover:text-primary transition-colors w-full text-left"
								>
									Services
								</button>
							</li>
							<li className="hover:bg-neutral-200/50  py-4 px-4 duration-200">
								<button
									onClick={() => scrollToSection('contact')}
									className="text-gray-700 hover:text-primary transition-colors w-full text-left"
								>
									Contact Us
								</button>
							</li>
							<li className="pt-4 border-t border-gray-200 flex flex-col space-y-2 ">
								<Link
									href="/auth/signin"
									className="hover:bg-orange-300 active:bg-orange-500 bg-orange-400 py-4 px-4 duration-200  text-white"
								>
									<button className="">Sign In</button>
								</Link>
								<Link
									href="/auth/signup"
									className="hover:bg-orange-300 active:bg-orange-500  py-4 px-4 duration-200 bg-orange-400 text-white"
								>
									<button className="">Get Started</button>
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
