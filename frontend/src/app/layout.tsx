import { Providers } from '@/components/providers';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: 'Job Application Tracker',
	description: 'Track and manage your job applications efficiently',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Providers>{children}</Providers>
				<Toaster richColors />
			</body>
		</html>
	);
}
