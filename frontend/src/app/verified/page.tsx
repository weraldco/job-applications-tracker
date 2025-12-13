import VerifiedChecker from '@/components/verified-check';
import { Suspense } from 'react';

const VerifiedUser = () => {
	return (
		<Suspense fallback={<p>Loading for verification..</p>}>
			<VerifiedChecker></VerifiedChecker>
		</Suspense>
	);
};

export default VerifiedUser;
