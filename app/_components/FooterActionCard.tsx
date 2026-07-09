"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	Bot,
	Clock,
	HelpCircle,
	LayoutGrid,
	Mail,
	MapPin,
	MessageCircle,
	Phone,
} from "lucide-react";
import { usePhone } from "@/app/_lib/usePhone";
import { returnToMainMenu } from "@/app/actions/booking";

type Panel = "help" | "agent" | null;

const FAQ_ITEMS = [
	{
		q: "How do I book an appointment?",
		a: "Verify your ID, enter the OTP, choose your service and centre, then confirm.",
	},
	{
		q: "What should I bring?",
		a: "Bring your original National ID and documents for your selected service.",
	},
];

function DockItem({
	icon: Icon,
	label,
	active,
	onClick,
}: {
	icon: React.ElementType;
	label: string;
	active: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`flex min-w-0 flex-1 flex-col items-center gap-1.5 px-2 py-1 transition-colors ${
				active ? "text-hgreen" : "text-muted"
			}`}
		>
			<Icon className="h-6 w-6" strokeWidth={1.75} />
			<span className="text-center text-[11px] font-medium leading-tight">
				{label}
			</span>
		</button>
	);
}

function ContactTile({
	icon: Icon,
	label,
	href,
}: {
	icon: React.ElementType;
	label: string;
	href: string;
}) {
	return (
		<a
			href={href}
			className="flex flex-1 flex-col items-center gap-2 rounded-2xl border border-line bg-white px-3 py-4 transition-colors active:bg-surface"
		>
			<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-tint text-hgreen">
				<Icon className="h-5 w-5" />
			</span>
			<span className="text-sm font-medium text-ink">{label}</span>
		</a>
	);
}

export default function FooterActionCard() {
	const router = useRouter();
	const phone = usePhone();
	const [panel, setPanel] = useState<Panel>(null);

	const homeHref = phone ? `/?phone=${encodeURIComponent(phone)}` : "/";

	function togglePanel(next: Panel) {
		setPanel(current => (current === next ? null : next));
	}

	async function onMenu() {
		await returnToMainMenu();
		router.push(homeHref);
	}

	return (
		<div className="fixed inset-x-0 bottom-0 z-50">
			<div className="mx-auto w-full max-w-md">
				{panel && (
					<div className="border-x border-t border-line bg-white px-4 pt-4 pb-3">
						<div className="mb-3 flex justify-center">
							<div className="h-1 w-10 rounded-full bg-line" />
						</div>

						{panel === "help" && (
							<div>
								<p className="text-[11px] font-semibold tracking-wide text-muted uppercase">
									Help &amp; Support
								</p>
								<ul className="mt-3 space-y-2.5">
									{FAQ_ITEMS.map(item => (
										<li key={item.q}>
											<p className="text-sm font-semibold text-ink">
												{item.q}
											</p>
											<p className="mt-0.5 text-xs leading-snug text-muted">
												{item.a}
											</p>
										</li>
									))}
								</ul>
								<div className="mt-4 flex gap-2">
									<ContactTile
										icon={Phone}
										label="Call"
										href="tel:0206900020"
									/>
									<ContactTile
										icon={Mail}
										label="Email"
										href="mailto:info@hudumakenya.go.ke"
									/>
									<ContactTile
										icon={MessageCircle}
										label="WhatsApp"
										href="https://wa.me/254706900020"
									/>
								</div>
							</div>
						)}

						{panel === "agent" && (
							<div>
								<p className="text-[11px] font-semibold tracking-wide text-muted uppercase">
									Contact Support
								</p>
								<div className="mt-3 flex gap-2">
									<ContactTile
										icon={Phone}
										label="Call"
										href="tel:0206900020"
									/>
									<ContactTile
										icon={Mail}
										label="Email"
										href="mailto:info@hudumakenya.go.ke"
									/>
									<ContactTile
										icon={MessageCircle}
										label="WhatsApp"
										href="https://wa.me/254706900020"
									/>
								</div>
								<div className="mt-3 flex items-start gap-3 rounded-2xl border border-line bg-surface px-3.5 py-3">
									<MapPin className="mt-0.5 h-5 w-5 shrink-0 text-hgreen" />
									<div>
										<p className="text-sm font-semibold text-ink">
											GPO Nairobi Huduma Centre
										</p>
										<p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
											<Clock className="h-3.5 w-3.5" />
											Mon–Fri 8am–5pm · Sat 8am–1pm
										</p>
										<a
											href="tel:0206900020"
											className="mt-1 block text-xs font-semibold text-hgreen"
										>
											020 690 0020
										</a>
									</div>
								</div>
							</div>
						)}
					</div>
				)}

				<div className="rounded-t-2xl border-t border-line bg-white shadow-[0_-8px_30px_rgba(16,34,78,0.1)]">
					<button
						type="button"
						onClick={() => setPanel(p => (p ? null : "help"))}
						aria-expanded={panel !== null}
						aria-label={panel ? "Collapse footer" : "Expand footer"}
						className="flex w-full justify-center py-2.5"
					>
						<div className="h-1 w-10 rounded-full bg-line" />
					</button>
					<div className="flex px-2 pb-4">
						<DockItem
							icon={HelpCircle}
							label="Help & Support"
							active={panel === "help"}
							onClick={() => togglePanel("help")}
						/>
						<DockItem
							icon={Bot}
							label="Connect Agent"
							active={panel === "agent"}
							onClick={() => togglePanel("agent")}
						/>
						<DockItem
							icon={LayoutGrid}
							label="Menu"
							active={false}
							onClick={onMenu}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
