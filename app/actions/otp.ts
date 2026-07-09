"use server";

import { getPending, promoteToSession } from "@/app/_lib/session";
import { checkRateLimit } from "@/app/_lib/throttle";
import { maskPhone } from "@/app/_lib/format";

export interface OtpResult {
	success: boolean;
	error?: string;
}

/**
 * Verify the OTP. Demo behaviour: any 6-digit code is accepted (real OTP send
 * is mocked). On success the pending lookup is promoted to a verified session,
 * which gates the review/confirm steps.
 */
export async function verifyOtp(codeRaw: string): Promise<OtpResult> {
	const code = (codeRaw || "").replace(/\D/g, "");

	const pending = await getPending();
	if (!pending) {
		return { success: false, error: "Session expired. Please start again." };
	}

	const limit = checkRateLimit(`otp:${pending.phone}`, 6, 10 * 60);
	if (!limit.allowed) {
		return {
			success: false,
			error: `Too many attempts. Try again in ${Math.ceil(
				limit.retryAfterSeconds / 60,
			)} min.`,
		};
	}

	if (code.length !== 6) {
		return { success: false, error: "Enter the 6-digit code." };
	}

	await promoteToSession();
	return { success: true };
}

/** Masked destination for the current pending lookup (for display / resend). */
export async function getPendingMaskedPhone(): Promise<string | null> {
	const pending = await getPending();
	return pending ? maskPhone(pending.phone) : null;
}
