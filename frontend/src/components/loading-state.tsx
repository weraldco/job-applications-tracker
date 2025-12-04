import { LoaderCircle } from 'lucide-react';

const LoadingState = () => {
	return (
		<div className="w-full  h-screen flex flex-col items-center justify-center">
			<div className="animate-spin">
				<LoaderCircle size={70}></LoaderCircle>
			</div>
			<span>Loading..</span>
		</div>
	);
};

export default LoadingState;
