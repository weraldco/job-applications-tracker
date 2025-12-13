'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import useCheckVerified from '@/hooks/use-check-verified';
import { supabase } from '@/lib/supabase';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

const VerifyEmailPage = () => {
	const searchParams = useSearchParams();
	const email = searchParams.get('email');

	const { loading } = useCheckVerified();
	const resendEmail = async () => {
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
		}

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
							disabled={loading}
							className="bg-[#ef831e] hover:bg-[#f69234] active:bg-[#d1721a] duration-200 text-white border-0 outline-0 py-7 text-sm"
						>
							{loading ? 'Sending...' : 'RESEND EMAIL VERIFICATION'}
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default VerifyEmailPage;
