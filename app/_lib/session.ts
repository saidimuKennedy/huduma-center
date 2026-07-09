// Server-side session cookies.
//
// Two stages, both httpOnly so identity never touches client JS:
//   huduma_pending  — set after a successful ID lookup, before OTP is verified.
//   huduma_session  — set once OTP is verified; gates the review/confirm steps.
//
// Demo limitation: the payload is stored as JSON, not signed. For production,
// sign/encrypt it (e.g. JWT/iron-session) so it can't be forged.

import "server-only";
import { cookies } from "next/headers";
import type { CitizenProfile } from "./types";

const PENDING = "huduma_pending";
const SESSION = "huduma_session";
const TTL_SECONDS = 10 * 60; // sliding 10 minutes

const baseOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "lax" as const,
	path: "/",
	maxAge: TTL_SECONDS,
};

function encode(profile: CitizenProfile): string {
	return JSON.stringify(profile);
}

function decode(value: string | undefined): CitizenProfile | null {
	if (!value) return null;
	try {
		const p = JSON.parse(value) as CitizenProfile;
		if (p && p.idNumber && p.phone) return p;
		return null;
	} catch {
		return null;
	}
}

export async function setPending(profile: CitizenProfile): Promise<void> {
	const store = await cookies();
	store.set(PENDING, encode(profile), baseOptions);
}

export async function getPending(): Promise<CitizenProfile | null> {
	const store = await cookies();
	return decode(store.get(PENDING)?.value);
}

/** Promote a pending lookup to a verified session (called after OTP passes). */
export async function promoteToSession(): Promise<CitizenProfile | null> {
	const store = await cookies();
	const profile = decode(store.get(PENDING)?.value);
	if (!profile) return null;
	store.set(SESSION, encode(profile), baseOptions);
	store.delete(PENDING);
	return profile;
}

/**
 * Read the verified session. Read-only so it is safe to call from Server
 * Components (which cannot write cookies). Use `refreshSession()` from within a
 * Server Action to slide the expiry.
 */
export async function getSession(): Promise<CitizenProfile | null> {
	const store = await cookies();
	return decode(store.get(SESSION)?.value);
}

/** Slide the session expiry. Only call from a Server Action / Route Handler. */
export async function refreshSession(): Promise<void> {
	const store = await cookies();
	const profile = decode(store.get(SESSION)?.value);
	if (profile) store.set(SESSION, encode(profile), baseOptions);
}

export async function clearSession(): Promise<void> {
	const store = await cookies();
	store.delete(SESSION);
	store.delete(PENDING);
}
