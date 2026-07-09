// Server-only environment access.
// Per project convention: never use default values for required env vars — throw.

function required(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}
	return value;
}

/** Base URL of the upstream lookup API (shared with the tax_webviews service). */
export function getApiUrl(): string {
	return required("API_URL");
}

/** Public URL of this app (used when building WhatsApp-facing links). */
export function getAppUrl(): string {
	return required("APP_URL");
}

/**
 * Demo lookup mode. When "mock" (default for local demos without upstream
 * access) the citizen lookup returns canned data instead of calling API_URL.
 * Set LOOKUP_MODE=live to hit the real endpoint.
 */
export function getLookupMode(): "mock" | "live" {
	return process.env.LOOKUP_MODE === "live" ? "live" : "mock";
}

/**
 * OTP mode. "live" sends/validates real codes via the Pesaflow USSD gateway
 * (same API_URL). "mock" accepts any 6 characters without sending.
 */
export function getOtpMode(): "mock" | "live" {
	return process.env.OTP_MODE === "live" ? "live" : "mock";
}

/**
 * Chatnation Meta proxy config for sending WhatsApp messages (same integration
 * pssf/tax_webviews use). Throws if unset — the confirmation send is real.
 */
export function getChatnationConfig(): {
	apiUrl: string;
	phoneNumberId: string;
	accessToken: string;
} {
	return {
		apiUrl: required("CHATNATION_API_URL"),
		phoneNumberId: required("CHATNATION_WA_PHONE_NUMBER_ID"),
		accessToken: required("CHATNATION_WA_ACCESS_TOKEN"),
	};
}
