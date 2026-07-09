"use client";

import { useEffect, useState } from "react";
import { cleanPhoneNumber } from "./format";
import { getKnownPhone, saveKnownPhone } from "./session-store";

/**
 * Resolves the recipient MSISDN for the flow.
 *
 * The WhatsApp template opens the webview with `?phone={{phone}}` (also accepts
 * `number` / `msisdn`). We read it straight from `window.location.search` — this
 * is more reliable than `useSearchParams()`, which can return empty on the
 * first client render of a production build. The value is normalised and
 * persisted so it survives reloads and in-app navigation.
 *
 * Returns the cleaned phone, or "" until it is known.
 */
function readFromUrl(): string {
	if (typeof window === "undefined") return "";
	const p = new URLSearchParams(window.location.search);
	return p.get("phone") || p.get("number") || p.get("msisdn") || "";
}

export function usePhone(): string {
	const [phone, setPhone] = useState("");

	useEffect(() => {
		const raw = readFromUrl() || getKnownPhone() || "";
		if (!raw) return;
		const clean = cleanPhoneNumber(raw);
		saveKnownPhone(clean);
		setPhone(clean);
	}, []);

	return phone;
}
