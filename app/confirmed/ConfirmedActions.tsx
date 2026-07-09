"use client";

import { MessageCircle, Download } from "lucide-react";
import { PrimaryLink } from "@/app/_components/ui";
import { encodeTicket } from "@/app/_lib/ticket-token";
import type { BookingResult } from "@/app/_lib/types";

export default function ConfirmedActions({
	booking,
}: {
	booking: BookingResult;
}) {
	const pdfUrl = `/api/ticket?d=${encodeTicket(booking)}`;

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
		</div>
	);
}
