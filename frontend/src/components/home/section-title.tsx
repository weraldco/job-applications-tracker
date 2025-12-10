import TitleTag from './title-tag';

const SectionTitle = ({
	tagTitle,
	title,
	description,
}: {
	tagTitle: string;
	title: string;
	description: string;
}) => {
	return (
		<div className="text-center mb-12 sm:mb-16 flex flex-col gap-4 md:gap-6">
			<div className="w-full flex items-center justify-center">
				<TitleTag>{tagTitle}</TitleTag>
			</div>
			<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
				{title}
			</h2>
			<p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
				{description}
			</p>
		</div>
	);
};

export default SectionTitle;
