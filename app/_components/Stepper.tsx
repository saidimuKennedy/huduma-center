import { Check } from "lucide-react";
import { STEPS, stepNumber, type StepKey } from "@/app/_lib/steps";

export default function Stepper({ current }: { current: StepKey }) {
	const currentNum = stepNumber(current);

	return (
		<div className="flex items-start">
			{STEPS.map((step, i) => {
				const num = i + 1;
				const isDone = num < currentNum;
				const isActive = num === currentNum;
				return (
					<div
						key={step.key}
						className="flex flex-1 flex-col items-center"
					>
						<div className="flex w-full items-center">
							{/* left connector */}
							<span
								className={`h-0.5 flex-1 ${
									i === 0
										? "opacity-0"
										: isDone || isActive
											? "bg-brand"
											: "bg-line"
								}`}
							/>
							<span
								className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
									isDone
										? "bg-brand text-white"
										: isActive
											? "bg-brand text-white ring-4 ring-brand-tint"
											: "bg-line text-muted"
								}`}
							>
								{isDone ? <Check className="h-4 w-4" /> : num}
							</span>
							{/* right connector */}
							<span
								className={`h-0.5 flex-1 ${
									i === STEPS.length - 1
										? "opacity-0"
										: isDone
											? "bg-brand"
											: "bg-line"
								}`}
							/>
						</div>
						<span
							className={`mt-1.5 text-[10px] font-medium ${
								isActive || isDone
									? "text-navy"
									: "text-muted"
							}`}
						>
							{step.short}
						</span>
					</div>
				);
			})}
		</div>
	);
}
