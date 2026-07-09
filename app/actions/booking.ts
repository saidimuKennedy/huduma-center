"use server";

import { cookies } from "next/headers";
import { getSession, refreshSession, clearSession } from "@/app/_lib/session";
import { sendAppointmentConfirmation } from "./whatsapp";
import type { BookingResult, BookingSelection } from "@/app/_lib/types";

const BOOKING_COOKIE = "huduma_booking";

export interface BookingActionResult {
	success: boolean;
	error?: string;
}

function generateTicket(): string {
	const n = Math.floor(10000 + Math.random() * 90000);
	return `CN-${n}`;
}

/**
 * Confirm the appointment (mock). The profile is read from the verified session
 * server-side — the client only supplies the selection, never identity.
 */
export async function bookAppointment(
	selection: BookingSelection,
): Promise<BookingActionResult> {
	const session = await getSession();
	if (!session) {
		return { success: false, error: "Session expired. Please start again." };
	}
	await refreshSession();

	const { service, serviceStation, county, date, timeSlot } = selection;
	if (!service || !serviceStation || !county || !date || !timeSlot) {
		return { success: false, error: "Please complete all fields." };
	}

	const result: BookingResult = {
		...selection,
		ticketNumber: generateTicket(),
		fullName: session.fullName,
	};

	const store = await cookies();
	store.set(BOOKING_COOKIE, JSON.stringify(result), {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: 30 * 60,
	});

	// Send the real WhatsApp confirmation. Non-fatal: a delivery failure must
	// not fail the booking — the appointment is already recorded.
	try {
		await sendAppointmentConfirmation(session.phone, result);
	} catch (err) {
		console.error("[WhatsApp] confirmation send failed:", err);
	}

	return { success: true };
}

export async function getBooking(): Promise<BookingResult | null> {
	const store = await cookies();
	const raw = store.get(BOOKING_COOKIE)?.value;
	if (!raw) return null;
	try {
		return JSON.parse(raw) as BookingResult;
	} catch {
		return null;
	}
}

/** End the booking flow and return the user to the main menu. */
export async function returnToMainMenu(): Promise<void> {
	const store = await cookies();
	store.delete(BOOKING_COOKIE);
	await clearSession();
}
