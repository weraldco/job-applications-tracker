import VerifyEmailClient from '@/components/verify-email-client';
import { Suspense } from 'react';

const VerifyEmailPage = () => {
	return (
		<Suspense fallback={<p>Verifying email..</p>}>
			<VerifyEmailClient />
		</Suspense>
	);
};

export default VerifyEmailPage;
