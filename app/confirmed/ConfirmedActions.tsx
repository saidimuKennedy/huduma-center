"use client";

import { MessageCircle, Download } from "lucide-react";
import { PrimaryButton } from "@/app/_components/ui";
import { useConfig } from "@/app/_lib/runtime-config";
import { formatDate } from "@/app/_lib/format";
import type { BookingResult } from "@/app/_lib/types";

export default function ConfirmedActions({
	booking,
}: {
	booking: BookingResult;
}) {
	const { whatsappNumber } = useConfig();

	function viewWhatsAppCopy() {
		const text = encodeURIComponent(
			`Huduma Centre appointment ${booking.ticketNumber} — ${booking.service} at ${booking.serviceStation} on ${formatDate(booking.date)}, ${booking.timeSlot}.`,
		);
		const url = whatsappNumber
			? `https://wa.me/${whatsappNumber}?text=${text}`
			: `https://wa.me/?text=${text}`;
		window.open(url, "_blank", "noopener");
	}

	function downloadTicket() {
		const lines = [
			"HUDUMA CENTRE — APPOINTMENT TICKET",
			"===================================",
			`Ticket Number : ${booking.ticketNumber}`,
			`Name          : ${booking.fullName}`,
			`Service       : ${booking.service}`,
			`Service Station: ${booking.serviceStation}`,
			`County        : ${booking.county}`,
			`Date          : ${formatDate(booking.date)}`,
			`Time          : ${booking.timeSlot}`,
			"",
			"Please bring your ID and required documents on the appointment day.",
		].join("\n");
		const blob = new Blob([lines], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `Huduma-Ticket-${booking.ticketNumber}.txt`;
		document.body.appendChild(a);
		a.click();
		a.remove();
		URL.revokeObjectURL(url);
	}

	return (
		<div className="mt-4 flex flex-col gap-3">
			<div className="flex items-center gap-2 rounded-xl bg-success-tint px-3.5 py-3 text-sm text-success">
				<MessageCircle className="h-4 w-4 shrink-0" />
				<span>A copy of your appointment has been sent to WhatsApp.</span>
			</div>

			<PrimaryButton onClick={viewWhatsAppCopy}>
				<MessageCircle className="h-5 w-5" />
				View WhatsApp Copy
			</PrimaryButton>

			<button
				onClick={downloadTicket}
				className="flex h-13 w-full items-center justify-center gap-2 rounded-xl border border-brand bg-white px-5 text-base font-semibold text-brand active:bg-brand-tint"
			>
				<Download className="h-5 w-5" />
				Download Ticket
			</button>
		</div>
	);
}
