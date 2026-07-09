// Shared formatting + PII-masking helpers. Safe for both client and server.

/**
 * Normalise a Kenyan MSISDN to 2547######## / 2541######## form.
 * Accepts 07xxxxxxxx, +2547xxxxxxxx, 2547xxxxxxxx, 7xxxxxxxx.
 */
export function cleanPhoneNumber(input: string): string {
	let n = (input || "").replace(/[^\d]/g, "");
	if (n.startsWith("0")) n = "254" + n.slice(1);
	else if (n.startsWith("7") || n.startsWith("1")) n = "254" + n;
	else if (n.startsWith("254")) {
		// already normalised
	} else if (n.startsWith("2540")) n = "254" + n.slice(4);
	return n;
}

/** +254 7••• ••381 — matches the mockup masking. */
export function maskPhone(input: string): string {
	const n = cleanPhoneNumber(input);
	if (n.length < 12) return input || "";
	const cc = n.slice(0, 3); // 254
	const first = n.slice(3, 4); // 7 / 1
	const last3 = n.slice(-3);
	return `+${cc} ${first}••• ••${last3}`;
}

/** Mask a National ID for display, keeping the last two digits. */
export function maskId(id: string): string {
	const n = (id || "").replace(/\s/g, "");
	if (n.length <= 2) return n;
	return "•".repeat(Math.max(0, n.length - 2)) + n.slice(-2);
}

/** National IDs are 6–9 digits. */
export function isValidNationalId(id: string): boolean {
	return /^\d{6,9}$/.test((id || "").trim());
}

/** Format a YYYY-MM-DD or Date as e.g. "15 Jul 2026". */
export function formatDate(value: string | Date): string {
	const d = typeof value === "string" ? new Date(value + "T00:00:00") : value;
	if (Number.isNaN(d.getTime())) return String(value);
	return d.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}
