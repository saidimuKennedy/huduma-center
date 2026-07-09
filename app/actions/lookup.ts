"use server";

import axios from "axios";
import { getApiUrl, getLookupMode } from "@/app/_lib/env";
import { cleanPhoneNumber, isValidNationalId, maskPhone } from "@/app/_lib/format";
import { setPending } from "@/app/_lib/session";
import { checkRateLimit } from "@/app/_lib/throttle";
import type { CitizenProfile } from "@/app/_lib/types";

export interface LookupResult {
	success: boolean;
	fullName?: string;
	maskedPhone?: string;
	error?: string;
}

/**
 * Resolve a citizen from their National ID. This is the ONE real integration:
 * in live mode it calls the shared upstream (same pattern/headers as the
 * tax_webviews lookup); in mock mode it returns canned demo data.
 *
 * The recipient's WhatsApp number (`phone`, from the ?phone= template param) is
 * carried through so later steps and the confirmation can reference it.
 */
async function fetchCitizen(
	idNumber: string,
	phone: string,
): Promise<CitizenProfile | null> {
	if (getLookupMode() === "mock") {
		// Canned record from the process-flow document.
		return {
			fullName: "John Kamau",
			idNumber,
			phone: phone || "254712345678",
			email: "john.kamau@email.com",
		};
	}

	// Live: real ID lookup — identical contract to tax_webviews pin-registration
	// and pssf kra/members: POST /ussd/id-lookup { id_number, msisdn, type }.
	const url = `${getApiUrl()}/ussd/id-lookup`;
	console.info("[lookup] POST", url, { id_number: idNumber, msisdn: phone });

	const res = await axios.post(
		url,
		{ id_number: idNumber, msisdn: phone, type: "citizen" },
		{
			headers: {
				"Content-Type": "application/json",
				"x-source-for": "whatsapp",
				"x-forwarded-for": "whatsapp",
			},
			timeout: 30000,
		},
	);

	console.info("[lookup] response", res.status, JSON.stringify(res.data));
	const d = res.data;
	if (!d || !d.name) return null;

	return {
		fullName: d.name,
		idNumber: d.id_number || idNumber,
		// The API returns the registered phone; fall back to the template number.
		phone: cleanPhoneNumber(d.msisdn || phone),
		email: d.email || "",
	};
}

export async function lookupCitizen(
	idNumberRaw: string,
	phoneRaw: string,
): Promise<LookupResult> {
	const idNumber = (idNumberRaw || "").trim();
	const phone = cleanPhoneNumber(phoneRaw || "");

	if (!isValidNationalId(idNumber)) {
		return { success: false, error: "Enter a valid National ID number." };
	}

	// Throttle by phone (falls back to id) to slow enumeration.
	const limit = checkRateLimit(`lookup:${phone || idNumber}`, 5, 10 * 60);
	if (!limit.allowed) {
		return {
			success: false,
			error: `Too many attempts. Try again in ${Math.ceil(
				limit.retryAfterSeconds / 60,
			)} min.`,
		};
	}

	try {
		const profile = await fetchCitizen(idNumber, phone);
		if (!profile) {
			return {
				success: false,
				error: "No records found for this ID number.",
			};
		}

		await setPending(profile);
		// OTP is sent separately (generateOtp) when the user taps
		// "Send OTP & Continue", so they can confirm the name first.

		// Return the resolved name so Screen 1 can confirm identity up-front —
		// the name is derived from the lookup, never typed by the user.
		return {
			success: true,
			fullName: profile.fullName,
			maskedPhone: maskPhone(profile.phone),
		};
	} catch {
		return {
			success: false,
			error: "We couldn't verify your ID right now. Please try again.",
		};
	}
}
