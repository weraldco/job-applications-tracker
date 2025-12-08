'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
	const currentYear = new Date().getFullYear();

	const footerLinks = {
		Product: [
			{ name: 'Features', href: '#services' },
			{ name: 'How It Works', href: '#how-to-use' },
			{ name: 'Pricing', href: '#' },
			{ name: 'FAQ', href: '#' },
		],
		Company: [
			{ name: 'About Us', href: '#' },
			{ name: 'Blog', href: '#' },
			{ name: 'Careers', href: '#' },
			{ name: 'Contact', href: '#contact' },
		],
		Legal: [
			{ name: 'Privacy Policy', href: '#' },
			{ name: 'Terms of Service', href: '#' },
			{ name: 'Cookie Policy', href: '#' },
		],
	};

	const socialLinks = [
		{ name: 'Facebook', icon: Facebook, href: '#' },
		{ name: 'Twitter', icon: Twitter, href: '#' },
		{ name: 'LinkedIn', icon: Linkedin, href: '#' },
		{ name: 'Email', icon: Mail, href: 'mailto:support@jobstashr.com' },
	];

	return (
		<footer className="bg-gray-900 text-gray-300">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
					{/* Logo and Description */}
					<div className="lg:col-span-2">
						<Link href="/" className="flex items-center space-x-2 mb-4">
							<Image
								src="/images/logo.webp"
								alt="JobStashr Logo"
								width={40}
								height={40}
								className="h-10 w-10"
							/>
							<span className="text-2xl font-bold text-white">JobStashr</span>
						</Link>
						<p className="text-gray-400 mb-4 max-w-sm">
							Your smart workspace for tracking every application, interview, and
							career move. Powered by AI.
						</p>
						{/* Social Links */}
						<div className="flex items-center space-x-4">
							{socialLinks.map((social) => {
								const Icon = social.icon;
								return (
									<a
										key={social.name}
										href={social.href}
										aria-label={social.name}
										className="p-2 rounded-full bg-gray-800 hover:bg-primary transition-colors"
									>
										<Icon className="h-5 w-5" />
									</a>
								);
							})}
						</div>
					</div>

					{/* Product Links */}
					<div>
						<h3 className="text-white font-semibold mb-4">Product</h3>
						<ul className="space-y-2">
							{footerLinks.Product.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="hover:text-white transition-colors"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Company Links */}
					<div>
						<h3 className="text-white font-semibold mb-4">Company</h3>
						<ul className="space-y-2">
							{footerLinks.Company.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="hover:text-white transition-colors"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Legal Links */}
					<div>
						<h3 className="text-white font-semibold mb-4">Legal</h3>
						<ul className="space-y-2">
							{footerLinks.Legal.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="hover:text-white transition-colors"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Copyright */}
				<div className="border-t border-gray-800 mt-12 pt-8 text-center">
					<p className="text-gray-400 text-sm">
						© {currentYear} JobStashr. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}

