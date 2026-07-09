// Client-side continuity store.
//
// Security note: this holds only the recipient's phone number (already known to
// the WhatsApp template that opened the webview). Identity — the National ID and
// the verified profile — never lives in client storage; it is kept in httpOnly
// cookies set by server actions and re-derived server-side on the review step.

const KNOWN_PHONE_KEY = "huduma_known_phone";

export function saveKnownPhone(phone: string): void {
	if (typeof window === "undefined" || !phone) return;
	try {
		localStorage.setItem(KNOWN_PHONE_KEY, phone);
	} catch {
		/* storage unavailable — non-fatal */
	}
}

export function getKnownPhone(): string | null {
	if (typeof window === "undefined") return null;
	try {
		return localStorage.getItem(KNOWN_PHONE_KEY);
	} catch {
		return null;
	}
}

export function clearKnownPhone(): void {
	if (typeof window === "undefined") return;
	try {
		localStorage.removeItem(KNOWN_PHONE_KEY);
	} catch {
		/* noop */
	}
}
