const JobRequirementItem = ({
	i,
	required,
}: {
	i: number;
	required: string;
}) => {
	return (
		<div className=" flex flex-row justify-start m-1 items-center gap-2">
			<span className="bg-neutral-400 text-white w-10 h-8 flex items-center justify-center rounded-full">
				{i + 1}
			</span>
			<span className="w-full">{required}</span>
		</div>
	);
};

export default JobRequirementItem;
