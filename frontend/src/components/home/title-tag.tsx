import { ReactNode } from 'react';

const TitleTag = ({ children }: { children: ReactNode }) => {
	return (
		<div className="w-full flex items-center justify-center">
			<h3 className="bg-[#ff9f40] px-4 py-1 rounded-full text-white border border-[#f8922d] font-semibold text-xs md:text-sm lg:text-base">
				{children}
			</h3>
		</div>
	);
};

export default TitleTag;
