"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { cleanPhoneNumber } from "./format";
import { getKnownPhone, saveKnownPhone } from "./session-store";

/**
 * Resolves the recipient MSISDN for the flow.
 *
 * The WhatsApp template opens the webview with `?phone={{phone}}` (also accepts
 * `number` / `msisdn`). We read it once, normalise it, and persist it so the
 * number survives reloads and in-app navigation.
 *
 * Returns the cleaned phone, or "" until it is known.
 */
export function usePhone(): string {
	const searchParams = useSearchParams();
	const [phone, setPhone] = useState("");

	useEffect(() => {
		const fromUrl =
			searchParams.get("phone") ||
			searchParams.get("number") ||
			searchParams.get("msisdn") ||
			"";

		const resolved = fromUrl || getKnownPhone() || "";
		if (!resolved) return;

		const clean = cleanPhoneNumber(resolved);
		saveKnownPhone(clean);
		setPhone(clean);
	}, [searchParams]);

	return phone;
}
