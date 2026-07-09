import { Lock, ChevronLeft } from "lucide-react";
import HudumaLogo from "./HudumaLogo";
import Stepper from "./Stepper";
import { TOTAL_STEPS, stepNumber, type StepKey } from "@/app/_lib/steps";

/**
 * Full-screen mobile shell for the booking flow (no device frame — the webview
 * opens full-bleed on the recipient's phone). Header + stepper + scrollable
 * content + a progress footer with a security cue.
 */
export default function BookingShell({
	current,
	footerLabel = "Secure verification",
	onBack,
	children,
}: {
	current: StepKey;
	footerLabel?: string;
	/** When provided, shows a back arrow in the header that calls this. */
	onBack?: () => void;
	children: React.ReactNode;
}) {
	const num = stepNumber(current);
	const pct = Math.round((num / TOTAL_STEPS) * 100);

	return (
		<div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-white">
			{/* Header */}
			<header className="px-5 pt-4">
				<div className="flex items-center gap-2">
					{onBack && (
						<button
							type="button"
							onClick={onBack}
							aria-label="Go back"
							className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-navy active:bg-line"
						>
							<ChevronLeft className="h-6 w-6" />
						</button>
					)}
					<HudumaLogo />
				</div>
				<h1 className="mt-2 text-center text-lg font-bold text-navy">
					Book Appointment
				</h1>
				<div className="mt-4">
					<Stepper current={current} />
				</div>
			</header>

			{/* Content */}
			<main className="flex flex-1 flex-col px-5 py-6">{children}</main>

			{/* Progress footer */}
			<footer className="px-5 pb-6">
				<div className="flex items-center gap-3">
					<span className="text-xs font-semibold text-brand">
						{num}/{TOTAL_STEPS}
					</span>
					<div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
						<div
							className="h-full rounded-full bg-brand transition-all"
							style={{ width: `${pct}%` }}
						/>
					</div>
					<span className="flex items-center gap-1 text-xs text-muted">
						<Lock className="h-3.5 w-3.5 text-success" />
						{footerLabel}
					</span>
				</div>
				<div className="mt-4 h-1 rounded-full bg-teal/70" />
			</footer>
		</div>
	);
}
