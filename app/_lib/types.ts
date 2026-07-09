/** Verified citizen record. `phone` is the MSISDN linked to the National ID. */
export interface CitizenProfile {
	fullName: string;
	idNumber: string;
	phone: string;
	email: string;
}

export interface BookingSelection {
	service: string;
	serviceStation: string;
	county: string;
	date: string; // YYYY-MM-DD
	timeSlot: string;
}

export interface BookingResult extends BookingSelection {
	ticketNumber: string; // e.g. CN-48291
	fullName: string;
}
