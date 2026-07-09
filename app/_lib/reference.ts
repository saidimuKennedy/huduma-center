// Mock reference data for the appointment selectors (demo only).

export const SERVICES = [
	"Passport Renewal",
	"Passport Application (New)",
	"National ID Application",
	"National ID Replacement",
	"Birth Certificate",
	"Good Conduct Certificate",
	"Driving License Renewal",
	"NHIF/SHA Registration",
	"KRA PIN Registration",
	"Business Name Registration",
];

export const SERVICE_STATIONS = [
	"Nairobi CBD Service Centre",
	"GPO Nairobi Huduma Centre",
	"Kibra Huduma Centre",
	"Mombasa Huduma Centre",
	"Kisumu Huduma Centre",
	"Nakuru Huduma Centre",
	"Eldoret Huduma Centre",
	"Nyeri Huduma Centre",
	"Machakos Huduma Centre",
	"Kakamega Huduma Centre",
];

export const COUNTIES = [
	"Nairobi County",
	"Mombasa County",
	"Kisumu County",
	"Nakuru County",
	"Uasin Gishu County",
	"Kiambu County",
	"Machakos County",
	"Kakamega County",
	"Nyeri County",
	"Kilifi County",
	"Kajiado County",
	"Meru County",
	"Kisii County",
	"Bungoma County",
];

export const TIME_SLOTS = [
	"08:30 AM",
	"09:00 AM",
	"09:30 AM",
	"10:00 AM",
	"10:30 AM",
	"11:00 AM",
	"11:30 AM",
	"12:00 PM",
	"02:00 PM",
	"02:30 PM",
	"03:00 PM",
	"03:30 PM",
	"04:00 PM",
];

/** Next `count` selectable dates (YYYY-MM-DD), skipping Sundays. */
export function upcomingDates(count = 14): string[] {
	const dates: string[] = [];
	const d = new Date();
	d.setDate(d.getDate() + 1); // start tomorrow
	while (dates.length < count) {
		if (d.getDay() !== 0) {
			dates.push(d.toISOString().slice(0, 10));
		}
		d.setDate(d.getDate() + 1);
	}
	return dates;
}
