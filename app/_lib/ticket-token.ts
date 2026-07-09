// Isomorphic base64url encoding of a booking, used to build the ticket PDF URL
// (/api/ticket?d=<token>). No PII beyond what's already on the ticket; the PDF
// route decodes this to render the document.
//
// Demo limitation: not signed. For production, sign the token (HMAC) so tickets
// can't be forged from a crafted URL.

import type { BookingResult } from "./types";

function toBase64Url(json: string): string {
	if (typeof window === "undefined") {
		return Buffer.from(json, "utf8").toString("base64url");
	}
	return btoa(unescape(encodeURIComponent(json)))
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
}

function fromBase64Url(token: string): string {
	const b64 = token.replace(/-/g, "+").replace(/_/g, "/");
	if (typeof window === "undefined") {
		return Buffer.from(b64, "base64").toString("utf8");
	}
	return decodeURIComponent(escape(atob(b64)));
}

export function encodeTicket(booking: BookingResult): string {
	return toBase64Url(JSON.stringify(booking));
}

export function decodeTicket(token: string): BookingResult | null {
	try {
		const b = JSON.parse(fromBase64Url(token)) as BookingResult;
		if (b && b.ticketNumber && b.fullName) return b;
		return null;
	} catch {
		return null;
	}
}
