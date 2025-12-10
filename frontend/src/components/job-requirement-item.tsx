const JobRequirementItem = ({
	i,
	required,
}: {
	i: number;
	required: string;
}) => {
	return (
		<div className=" flex flex-row justify-start m-1 items-center gap-2">
			<span className="text-neutral-500 border border-neutral-500 w-8 h-8 flex items-center justify-center rounded-full">
				{i + 1}
			</span>
			<span className="w-full">{required}</span>
		</div>
	);
};

export default JobRequirementItem;
