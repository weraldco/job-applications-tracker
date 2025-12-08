'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MessageSquare, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';

export default function ContactSection() {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		subject: '',
		message: '',
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Simulate form submission
		setTimeout(() => {
			toast.success('Message sent!', {
				description: 'We\'ll get back to you soon.',
			});
			setFormData({ name: '', email: '', subject: '', message: '' });
			setIsSubmitting(false);
		}, 1000);
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<section id="contact" className="py-20 sm:py-24 lg:py-28 bg-white">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<div className="text-center mb-12 sm:mb-16">
					<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
						Contact Us
					</h2>
					<p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
						Have questions? We'd love to hear from you. Send us a message and
						we'll respond as soon as possible.
					</p>
				</div>

				<div className="max-w-6xl mx-auto">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
						{/* Image Section */}
						<div className="order-2 lg:order-1">
							<div className="relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-lg">
								<div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
									<div className="text-center p-8">
										<Mail className="h-24 w-24 text-primary mx-auto mb-4 opacity-50" />
										<p className="text-gray-600 text-lg">
											Get in touch with our team
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Form Section */}
						<div className="order-1 lg:order-2">
							<Card className="border-2">
								<CardHeader>
									<CardTitle className="text-2xl flex items-center gap-2">
										<MessageSquare className="h-6 w-6 text-primary" />
										Send us a message
									</CardTitle>
									<CardDescription>
										Fill out the form below and we'll get back to you
									</CardDescription>
								</CardHeader>
								<CardContent>
									<form onSubmit={handleSubmit} className="space-y-4">
										<div className="space-y-2">
											<Label htmlFor="name">Name</Label>
											<Input
												id="name"
												name="name"
												type="text"
												placeholder="Your name"
												required
												value={formData.name}
												onChange={handleChange}
											/>
										</div>

										<div className="space-y-2">
											<Label htmlFor="email">Email</Label>
											<Input
												id="email"
												name="email"
												type="email"
												placeholder="your.email@example.com"
												required
												value={formData.email}
												onChange={handleChange}
											/>
										</div>

										<div className="space-y-2">
											<Label htmlFor="subject">Subject</Label>
											<Input
												id="subject"
												name="subject"
												type="text"
												placeholder="What's this about?"
												required
												value={formData.subject}
												onChange={handleChange}
											/>
										</div>

										<div className="space-y-2">
											<Label htmlFor="message">Message</Label>
											<Textarea
												id="message"
												name="message"
												placeholder="Tell us more..."
												required
												rows={5}
												value={formData.message}
												onChange={handleChange}
											/>
										</div>

										<Button
											type="submit"
											className="w-full"
											disabled={isSubmitting}
										>
											{isSubmitting ? (
												'Sending...'
											) : (
												<>
													<Send className="mr-2 h-4 w-4" />
													Send Message
												</>
											)}
										</Button>
									</form>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

