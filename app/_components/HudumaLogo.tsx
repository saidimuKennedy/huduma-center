/* eslint-disable @next/next/no-img-element */
// Official Huduma Kenya logo (public/huduma-logo.jpeg, 462x560).
export default function HudumaLogo({
	height = 64,
	className = "",
}: {
	height?: number;
	className?: string;
}) {
	return (
		<img
			src="/huduma-logo.jpeg"
			alt="Huduma Kenya — Service Excellence"
			width={462}
			height={560}
			style={{ height, width: "auto" }}
			className={className}
		/>
	);
}
