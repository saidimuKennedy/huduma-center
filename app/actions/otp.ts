"use server";

import axios from "axios";
import { getApiUrl, getOtpMode } from "@/app/_lib/env";
import { cleanPhoneNumber, maskPhone } from "@/app/_lib/format";
import { getPending, promoteToSession } from "@/app/_lib/session";
import { checkRateLimit } from "@/app/_lib/throttle";

export interface OtpResult {
	success: boolean;
	maskedPhone?: string;
	error?: string;
}

const OTP_LENGTH = 6;
const OTP_HEADERS = {
	"Content-Type": "application/json",
	"x-source-for": "whatsapp",
	"x-forwarded-for": "whatsapp",
};

/**
 * Send an OTP to the given phone via the Pesaflow USSD gateway.
 * Real: POST {API_URL}/ussd/otp { msisdn }. Mock: no-op success.
 */
export async function generateOtp(phoneRaw: string): Promise<OtpResult> {
	const msisdn = cleanPhoneNumber(phoneRaw || "");
	if (!msisdn) return { success: false, error: "No phone number available." };

	const limit = checkRateLimit(`otp-send:${msisdn}`, 4, 10 * 60);
	if (!limit.allowed) {
		return {
			success: false,
			error: `Too many requests. Try again in ${Math.ceil(
				limit.retryAfterSeconds / 60,
			)} min.`,
		};
	}

	if (getOtpMode() === "mock") {
		return { success: true, maskedPhone: maskPhone(msisdn) };
	}

	try {
		const res = await axios.post(
			`${getApiUrl()}/ussd/otp`,
			{ msisdn },
			{ headers: OTP_HEADERS, timeout: 30000 },
		);
		if (res.data && res.data.success === false) {
			return {
				success: false,
				error: res.data.message || "Failed to send OTP.",
			};
		}
		return { success: true, maskedPhone: maskPhone(msisdn) };
	} catch {
		return {
			success: false,
			error: "Couldn't send the code right now. Please try again.",
		};
	}
}

/**
 * Verify the OTP for the pending lookup and promote to a verified session.
 * Real: POST {API_URL}/ussd/validate-otp { msisdn, otp }. Mock: any 6 chars.
 * Pesaflow codes are uppercase alphanumeric, so we uppercase and don't strip.
 */
export async function verifyOtp(codeRaw: string): Promise<OtpResult> {
	const code = (codeRaw || "").trim().toUpperCase();

	const pending = await getPending();
	if (!pending) {
		return { success: false, error: "Session expired. Please start again." };
	}

	const msisdn = cleanPhoneNumber(pending.phone);
	const limit = checkRateLimit(`otp-verify:${msisdn}`, 6, 10 * 60);
	if (!limit.allowed) {
		return {
			success: false,
			error: `Too many attempts. Try again in ${Math.ceil(
				limit.retryAfterSeconds / 60,
			)} min.`,
		};
	}

	if (code.length !== OTP_LENGTH) {
		return { success: false, error: `Enter the ${OTP_LENGTH}-character code.` };
	}

	if (getOtpMode() === "mock") {
		await promoteToSession();
		return { success: true };
	}

	try {
		const res = await axios.post(
			`${getApiUrl()}/ussd/validate-otp`,
			{ msisdn, otp: code },
			{ headers: OTP_HEADERS, timeout: 30000 },
		);
		const ok = !res.data || res.data.success !== false;
		if (!ok) {
			return {
				success: false,
				error: res.data?.message || "Invalid code. Please try again.",
			};
		}
		await promoteToSession();
		return { success: true };
	} catch {
		return { success: false, error: "Invalid code. Please try again." };
	}
}

/** Masked destination for the current pending lookup (for display / resend). */
export async function getPendingMaskedPhone(): Promise<string | null> {
	const pending = await getPending();
	return pending ? maskPhone(pending.phone) : null;
}
