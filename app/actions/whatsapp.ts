"use server";

import { getChatnationConfig } from "@/app/_lib/env";
import { cleanPhoneNumber, formatDate } from "@/app/_lib/format";
import type { BookingResult } from "@/app/_lib/types";

/**
 * Send the appointment confirmation to the user on WhatsApp.
 *
 * Real send via the Chatnation Meta proxy (same path pssf/tax_webviews use):
 *   POST {CHATNATION_API_URL}/api/meta/v21.0/{phoneNumberId}/messages
 *
 * Uses a free-form text message, which is deliverable because the user is
 * inside the 24-hour customer-service window — they reached this webview by
 * tapping our WhatsApp template. No pre-approved template needed.
 */
export async function sendAppointmentConfirmation(
	recipientPhone: string,
	booking: BookingResult,
): Promise<void> {
	const { apiUrl, phoneNumberId, accessToken } = getChatnationConfig();
	const to = cleanPhoneNumber(recipientPhone);

	const message = [
		"✅ *Huduma Centre — Appointment Confirmed*",
		"",
		`*Ticket:* ${booking.ticketNumber}`,
		`*Name:* ${booking.fullName}`,
		`*Service:* ${booking.service}`,
		`*Service Station:* ${booking.serviceStation}`,
		`*Date:* ${formatDate(booking.date)}`,
		`*Time:* ${booking.timeSlot}`,
		"",
		"Please bring your ID and required documents on the appointment day.",
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
				type: "text",
				text: { preview_url: false, body: message },
			}),
		},
	);

	if (!res.ok) {
		throw new Error(
			`Chatnation Meta proxy responded ${res.status}: ${await res.text()}`,
		);
	}
}
