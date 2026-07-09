"use server";

import { getChatnationConfig, getAppUrl } from "@/app/_lib/env";
import { cleanPhoneNumber, formatDate } from "@/app/_lib/format";
import { encodeTicket } from "@/app/_lib/ticket-token";
import type { BookingResult } from "@/app/_lib/types";

/**
 * Send the appointment confirmation to the user on WhatsApp as a PDF ticket
 * (document message) with a summary caption.
 *
 * Real send via the Chatnation Meta proxy (same path pssf/tax_webviews use):
 *   POST {CHATNATION_API_URL}/api/meta/v21.0/{phoneNumberId}/messages
 *
 * Media/document messages are deliverable here because the user is inside the
 * 24-hour customer-service window — they reached this webview from our WhatsApp
 * template. Meta fetches the PDF from {APP_URL}/api/ticket, so APP_URL must be a
 * publicly reachable HTTPS URL in production.
 */
export async function sendAppointmentConfirmation(
	recipientPhone: string,
	booking: BookingResult,
): Promise<void> {
	const { apiUrl, phoneNumberId, accessToken } = getChatnationConfig();
	const to = cleanPhoneNumber(recipientPhone);

	const pdfUrl = `${getAppUrl()}/api/ticket?d=${encodeTicket(booking)}`;
	const filename = `Huduma-Ticket-${booking.ticketNumber}.pdf`;

	const caption = [
		"✅ *Huduma Centre — Appointment Confirmed*",
		"",
		`*Ticket:* ${booking.ticketNumber}`,
		`*Name:* ${booking.fullName}`,
		`*Service:* ${booking.service}`,
		`*Service Station:* ${booking.serviceStation}`,
		`*Date:* ${formatDate(booking.date)}`,
		`*Time:* ${booking.timeSlot}`,
		"",
		"Your ticket is attached. Please bring your ID and required documents on the appointment day.",
	].join("\n");

	const res = await fetch(
		`${apiUrl}/api/meta/v21.0/${phoneNumberId}/messages`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({
				messaging_product: "whatsapp",
				recipient_type: "individual",
				to,
				type: "document",
				document: { link: pdfUrl, caption, filename },
			}),
		},
	);

	if (!res.ok) {
		throw new Error(
			`Chatnation Meta proxy responded ${res.status}: ${await res.text()}`,
		);
	}
}
