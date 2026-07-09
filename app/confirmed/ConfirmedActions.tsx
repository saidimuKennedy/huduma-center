"use client";

import { useRouter } from "next/navigation";
import { Home, MessageCircle, Download } from "lucide-react";
import { PrimaryLink, SecondaryButton } from "@/app/_components/ui";
import { usePhone } from "@/app/_lib/usePhone";
import { returnToMainMenu } from "@/app/actions/booking";
import { encodeTicket } from "@/app/_lib/ticket-token";
import type { BookingResult } from "@/app/_lib/types";

export default function ConfirmedActions({
	booking,
}: {
	booking: BookingResult;
}) {
	const router = useRouter();
	const phone = usePhone();
	const pdfUrl = `/api/ticket?d=${encodeTicket(booking)}`;
	const homeHref = phone ? `/?phone=${encodeURIComponent(phone)}` : "/";

	async function onMainMenu() {
		await returnToMainMenu();
		router.push(homeHref);
	}

	return (
		<div className="mt-4 flex flex-col gap-3">
			<div className="flex items-center gap-2 rounded-xl bg-success-tint px-3.5 py-3 text-sm text-success">
				<MessageCircle className="h-4 w-4 shrink-0" />
				<span>
					Your ticket has been sent to your WhatsApp as a PDF.
				</span>
			</div>

			<PrimaryLink href={pdfUrl} target="_blank" rel="noopener" className="gap-2">
				<Download className="h-5 w-5" />
				Download Ticket
			</PrimaryLink>

			<SecondaryButton type="button" onClick={onMainMenu} className="gap-2">
				<Home className="h-5 w-5" />
				Main Menu
			</SecondaryButton>
		</div>
	);
}
