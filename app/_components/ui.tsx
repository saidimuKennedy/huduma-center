import { CheckCircle2, Info } from "lucide-react";

export function PrimaryButton({
	children,
	loading = false,
	...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
	return (
		<button
			{...props}
			disabled={props.disabled || loading}
			className={`flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3.5 text-base font-semibold text-white transition-colors active:bg-brand-dark disabled:opacity-50 ${props.className ?? ""}`}
		>
			{loading ? (
				<span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
			) : (
				children
			)}
		</button>
	);
}

/** Inline note banner. variant controls the tint + icon. */
export function Note({
	variant = "info",
	children,
}: {
	variant?: "info" | "success";
	children: React.ReactNode;
}) {
	const isSuccess = variant === "success";
	const Icon = isSuccess ? CheckCircle2 : Info;
	return (
		<div
			className={`flex items-start gap-2 rounded-xl px-3.5 py-3 text-sm ${
				isSuccess
					? "bg-success-tint text-success"
					: "bg-brand-tint text-brand-dark"
			}`}
		>
			<Icon className="mt-0.5 h-4 w-4 shrink-0" />
			<span className="leading-snug">{children}</span>
		</div>
	);
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
	return (
		<label className="mb-1.5 block text-xs font-semibold text-muted">
			{children}
		</label>
	);
}
