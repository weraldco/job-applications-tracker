'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import useCheckVerified from '@/hooks/use-check-verified';
import { supabase } from '@/lib/supabase';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
const VerifyEmailClient = () => {
	const searchParams = useSearchParams();

	const [count, setCount] = useState(0);
	const error = searchParams.get('error');
	const errorDescription = searchParams.get('error_description');
	console.log(count);
	useEffect(() => {
		if (error) {
			toast.error('Error', { description: 'Error in params!' });
		}
	}, [error, errorDescription]);

	const { loading } = useCheckVerified();

	useEffect(() => {
		if (count != 0) {
			setTimeout(() => {
				setCount((curr) => curr - 1);
			}, 1000);
		}
	}, [count]);

	const resendEmail = async () => {
		const { data } = await supabase.auth.getUser();
		const email = data.user?.email || searchParams.get('email');
		if (!email) {
			toast.error('Error', { description: 'Email not found' });
			return;
		}

		const { error } = await supabase.auth.resend({
			type: 'signup',
			email: email, // replace or pass dynamically
		});

		if (error) {
			toast.error('Error', { description: `Something went wrong. ${error}` });
			return;
		}

		setCount(30);
		toast.success('Success!', {
			description: 'Successfully sending email verification.',
		});
	};

	if (loading) return <p>Checking..</p>;
	return (
		<div className="bg-orange-50 h-screen w-full flex items-start pt-20 justify-center">
			<Card className=" max-w-2xl w-full bg-white border-0 ">
				<CardHeader className="border-b border-neutral-200">
					<h1 className="text-xl font-semibold">Verify Your Email</h1>
				</CardHeader>
				<CardContent className="space-y-4">
					<p>
						Your account was created successfully! We sent a verification link
						to your email. Please verify your account before logging in.
					</p>
					<div>
						<Button
							onClick={resendEmail}
							disabled={loading || count > 0}
							className="bg-[#ef831e] hover:bg-[#f69234] active:bg-[#d1721a] duration-200 text-white border-0 outline-0 py-7 text-sm"
						>
							{loading ? (
								'Sending...'
							) : (
								<div className="flex flex-row items-center gap-4">
									{count != 0 ? (
										<span className="flex items-center justify-center h-8 w-8 bg-orange-200 rounded-full text-neutral-500">
											{count}
										</span>
									) : (
										''
									)}
									RESEND VERIFICATION
								</div>
							)}
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default VerifyEmailClient;
