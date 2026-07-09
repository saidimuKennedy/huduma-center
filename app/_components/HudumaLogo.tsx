import Image from "next/image";

/** Official header mark: Republic emblem + huduma wordmark. */
export default function HudumaLogo({
	className = "",
}: {
	className?: string;
}) {
	return (
		<div className={`flex items-center gap-3 ${className}`}>
			<div className="relative h-16 w-[92px] shrink-0 overflow-hidden sm:h-[72px] sm:w-[104px]">
				<Image
					src="/huduma2.jpg"
					alt="Republic of Kenya"
					fill
					priority
					className="object-cover object-left"
					sizes="104px"
				/>
			</div>
			<span className="text-[30px] font-bold leading-none tracking-tight text-ink lowercase sm:text-[34px]">
				huduma
			</span>
		</div>
	);
}
