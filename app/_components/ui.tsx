"use client";

import { useEffect, useRef, useState } from "react";
import { Check, CheckCircle2, ChevronDown, Info } from "lucide-react";

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

export function SelectField({
	icon: Icon,
	label,
	value,
	onChange,
	options,
	display,
}: {
	icon: React.ElementType;
	label: string;
	value: string;
	onChange: (v: string) => void;
	options: string[];
	display?: (v: string) => string;
}) {
	const [open, setOpen] = useState(false);
	const rootRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;
		function onPointerDown(e: PointerEvent) {
			if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
		}
		document.addEventListener("pointerdown", onPointerDown);
		return () => document.removeEventListener("pointerdown", onPointerDown);
	}, [open]);

	const shown = display ? display(value) : value;

	return (
		<div ref={rootRef} className="relative">
			<button
				type="button"
				aria-haspopup="listbox"
				aria-expanded={open}
				onClick={() => setOpen(o => !o)}
				className={`flex w-full items-center gap-3 rounded-xl border bg-white px-3.5 py-2 text-left transition-colors ${
					open
						? "border-brand ring-2 ring-brand-tint"
						: "border-line hover:border-brand/40"
				}`}
			>
				<Icon className="h-5 w-5 shrink-0 text-muted" />
				<div className="min-w-0 flex-1">
					<span className="block text-[10px] font-medium text-muted">
						{label}
					</span>
					<span className="block truncate text-sm font-medium text-ink">
						{shown}
					</span>
				</div>
				<ChevronDown
					className={`h-4 w-4 shrink-0 text-muted transition-transform ${
						open ? "rotate-180" : ""
					}`}
				/>
			</button>

			{open && (
				<ul
					role="listbox"
					aria-label={label}
					className="absolute top-full right-0 left-0 z-50 mt-1.5 max-h-52 overflow-y-auto rounded-xl border border-line bg-white py-1 shadow-[0_8px_24px_rgba(16,34,78,0.12)]"
				>
					{options.map(option => {
						const selected = option === value;
						const text = display ? display(option) : option;
						return (
							<li key={option} role="option" aria-selected={selected}>
								<button
									type="button"
									onClick={() => {
										onChange(option);
										setOpen(false);
									}}
									className={`flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm transition-colors ${
										selected
											? "bg-brand-tint font-semibold text-brand"
											: "text-ink hover:bg-surface"
									}`}
								>
									<span className="min-w-0 flex-1 truncate">{text}</span>
									{selected && (
										<Check className="h-4 w-4 shrink-0 text-brand" />
									)}
								</button>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}
