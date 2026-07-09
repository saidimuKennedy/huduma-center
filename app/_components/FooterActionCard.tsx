"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
	ChevronUp,
	HelpCircle,
	Headphones,
	LayoutGrid,
	ArrowLeft,
} from "lucide-react";
import { usePhone } from "@/app/_lib/usePhone";
import { returnToMainMenu } from "@/app/actions/booking";

const FAQ_ITEMS = [
	{
		q: "How do I book an appointment?",
		a: "Verify your ID, enter the OTP sent to your phone, choose your service and centre, then confirm.",
	},
	{
		q: "What should I bring?",
		a: "Bring your original National ID and any documents required for the service you selected.",
	},
	{
		q: "Can I change my appointment?",
		a: "Return to the main menu and start a new booking, or call the Huduma Contact Centre for help.",
	},
];

function ActionButton({
	icon: Icon,
	label,
	onClick,
	href,
}: {
	icon: React.ElementType;
	label: string;
	onClick?: () => void;
	href?: string;
}) {
	const content = (
		<>
			<span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-tint text-brand">
				<Icon className="h-5 w-5" />
			</span>
			<span className="text-[11px] font-semibold text-navy">{label}</span>
		</>
	);

	const className =
		"flex min-w-0 flex-1 flex-col items-center gap-1.5 px-2 py-1 transition-opacity active:opacity-70";

	if (href) {
		return (
			<a href={href} className={className}>
				{content}
			</a>
		);
	}

	return (
		<button type="button" onClick={onClick} className={className}>
			{content}
		</button>
	);
}

export default function FooterActionCard() {
	const router = useRouter();
	const phone = usePhone();
	const rootRef = useRef<HTMLDivElement>(null);
	const [open, setOpen] = useState(false);
	const [showFaq, setShowFaq] = useState(false);

	const homeHref = phone ? `/?phone=${encodeURIComponent(phone)}` : "/";

	useEffect(() => {
		if (!open) return;
		function onPointerDown(e: PointerEvent) {
			if (!rootRef.current?.contains(e.target as Node)) {
				setOpen(false);
				setShowFaq(false);
			}
		}
		document.addEventListener("pointerdown", onPointerDown);
		return () => document.removeEventListener("pointerdown", onPointerDown);
	}, [open]);

	function toggleOpen() {
		setOpen(o => {
			if (o) setShowFaq(false);
			return !o;
		});
	}

	async function onMenu() {
		await returnToMainMenu();
		router.push(homeHref);
	}

	return (
		<div ref={rootRef} className="mb-3">
			<div
				className={`overflow-hidden rounded-2xl border border-line bg-white shadow-[0_4px_20px_rgba(16,34,78,0.08)] transition-shadow ${
					open ? "shadow-[0_8px_28px_rgba(16,34,78,0.12)]" : ""
				}`}
			>
				{open && (
					<div className="border-b border-line px-4 pt-4 pb-3">
						{showFaq ? (
							<div>
								<button
									type="button"
									onClick={() => setShowFaq(false)}
									className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-brand"
								>
									<ArrowLeft className="h-3.5 w-3.5" />
									Back
								</button>
								<p className="mb-2 text-xs font-bold text-navy">
									Help &amp; FAQ
								</p>
								<ul className="space-y-2.5">
									{FAQ_ITEMS.map(item => (
										<li key={item.q}>
											<p className="text-xs font-semibold text-ink">
												{item.q}
											</p>
											<p className="mt-0.5 text-[11px] leading-snug text-muted">
												{item.a}
											</p>
										</li>
									))}
								</ul>
								<p className="mt-3 text-[11px] text-muted">
									Call{" "}
									<a
										href="tel:0206900020"
										className="font-semibold text-brand"
									>
										020 690 0020
									</a>{" "}
									or{" "}
									<a
										href="tel:1919"
										className="font-semibold text-brand"
									>
										1919
									</a>
								</p>
							</div>
						) : (
							<div className="flex items-start justify-between gap-2">
								<ActionButton
									icon={HelpCircle}
									label="Help"
									onClick={() => setShowFaq(true)}
								/>
								<ActionButton
									icon={LayoutGrid}
									label="Menu"
									onClick={onMenu}
								/>
								<ActionButton
									icon={Headphones}
									label="Agent"
									href="tel:0206900020"
								/>
							</div>
						)}
					</div>
				)}

				<button
					type="button"
					onClick={toggleOpen}
					aria-expanded={open}
					className="flex w-full items-center justify-center gap-2 py-3 text-xs font-semibold text-muted transition-colors active:bg-surface"
				>
					<ChevronUp
						className={`h-4 w-4 transition-transform duration-200 ${
							open ? "rotate-0" : "rotate-180"
						}`}
					/>
					{open ? "Close" : "Quick actions"}
				</button>
			</div>
		</div>
	);
}
