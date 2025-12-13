'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import useCheckVerified from '@/hooks/use-check-verified';
import { CircleCheckBigIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const VerifiedUser = () => {
	const { loading } = useCheckVerified();

	const router = useRouter();

	useEffect(() => {
		const timer = setTimeout(() => {
			router.push('/auth/signin');
		}, 3000);

		return () => clearTimeout(timer);
	}, [loading, router]);

	if (loading) return <p>Checking..</p>;

	return (
		<div className="flex flex-col bg-orange-50 h-screen w-full items-center pt-10 justify-start gap-4">
			<CircleCheckBigIcon size={70} className="text-green-500" />
			<Card className="w-full max-w-sm bg-white border-0">
				<CardHeader className="w-full border-b border-neutral-200">
					<h1 className="text-2xl text-center font-bold text-orange-400  w-full">
						Successfully Verified!
					</h1>
				</CardHeader>
				<CardContent>
					<p className="text-center">
						Thank you for verifying your email address!
					</p>
				</CardContent>
			</Card>
		</div>
	);
};

export default VerifiedUser;
