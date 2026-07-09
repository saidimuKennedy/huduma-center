import type { NextRequest } from "next/server";
import { decodeTicket } from "@/app/_lib/ticket-token";
import { generateTicketPdf } from "@/app/_lib/pdf";

export const dynamic = "force-dynamic";

/**
 * Serves the appointment ticket PDF for a booking encoded in `?d=<token>`.
 *
 * Public by design: WhatsApp/Meta fetches this URL to attach the document, and
 * it cannot present cookies. The token carries only ticket-face data (no ID or
 * phone), so exposure is limited to what the ticket holder already has.
 */
export async function GET(req: NextRequest) {
	const token = req.nextUrl.searchParams.get("d");
	const booking = token ? decodeTicket(token) : null;
	if (!booking) {
		return new Response("Invalid or missing ticket", { status: 400 });
	}

	const pdf = await generateTicketPdf(booking);

	return new Response(pdf as BodyInit, {
		status: 200,
		headers: {
			"Content-Type": "application/pdf",
			"Content-Disposition": `attachment; filename="Huduma-Ticket-${booking.ticketNumber}.pdf"`,
			"Cache-Control": "no-store",
		},
	});
}
