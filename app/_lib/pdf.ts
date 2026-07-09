import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { formatDate } from "./format";
import type { BookingResult } from "./types";

const BRAND = rgb(0.09, 0.27, 0.88);
const NAVY = rgb(0.063, 0.133, 0.306);
const SUCCESS = rgb(0.086, 0.627, 0.29);
const MUTED = rgb(0.39, 0.45, 0.55);
const LINE = rgb(0.9, 0.91, 0.94);

/** Generate a clean, branded appointment ticket as a PDF. */
export async function generateTicketPdf(
	booking: BookingResult,
): Promise<Uint8Array> {
	const doc = await PDFDocument.create();
	doc.setTitle(`Huduma Ticket ${booking.ticketNumber}`);
	doc.setAuthor("Huduma Centre");

	const page = doc.addPage([420, 620]); // compact ticket format
	const { width, height } = page.getSize();
	const font = await doc.embedFont(StandardFonts.Helvetica);
	const bold = await doc.embedFont(StandardFonts.HelveticaBold);

	const M = 36; // margin
	const cx = width / 2;

	// Top brand bar
	page.drawRectangle({ x: 0, y: height - 8, width, height: 8, color: BRAND });

	// Logo (centered)
	const topM = 36;
	let logoBottom = height - topM;
	try {
		const bytes = readFileSync(
			join(process.cwd(), "public", "huduma-logo.jpeg"),
		);
		const logo = await doc.embedJpg(bytes);
		const lw = 72;
		const lh = (lw * logo.height) / logo.width;
		const ly = height - topM - lh;
		page.drawImage(logo, { x: cx - lw / 2, y: ly, width: lw, height: lh });
		logoBottom = ly;
	} catch {
		/* logo optional */
	}

	// Title anchored a clear gap below the logo, whatever its height.
	let y = logoBottom - 30;

	const centerText = (
		text: string,
		size: number,
		f = font,
		color = NAVY,
	) => {
		const w = f.widthOfTextAtSize(text, size);
		page.drawText(text, { x: cx - w / 2, y, size, font: f, color });
	};

	centerText("Appointment Confirmed", 17, bold, NAVY);
	y -= 18;
	centerText("Huduma Centre — Service Excellence", 9, font, MUTED);

	// Ticket number block
	y -= 34;
	page.drawRectangle({
		x: M,
		y: y - 46,
		width: width - 2 * M,
		height: 60,
		borderColor: LINE,
		borderWidth: 1,
		color: rgb(0.98, 0.99, 1),
	});
	{
		const label = "TICKET NUMBER";
		const lw = font.widthOfTextAtSize(label, 8);
		page.drawText(label, {
			x: cx - lw / 2,
			y: y + 0,
			size: 8,
			font,
			color: MUTED,
		});
		const t = booking.ticketNumber;
		const tw = bold.widthOfTextAtSize(t, 24);
		page.drawText(t, {
			x: cx - tw / 2,
			y: y - 30,
			size: 24,
			font: bold,
			color: SUCCESS,
		});
	}

	// Detail rows
	y -= 84;
	const rows: [string, string][] = [
		["Name", booking.fullName],
		["Service", booking.service],
		["Service Station", booking.serviceStation],
		["County", booking.county],
		["Date", formatDate(booking.date)],
		["Time", booking.timeSlot],
	];
	const rowH = 30;
	for (const [label, value] of rows) {
		page.drawText(label, { x: M, y, size: 10, font, color: MUTED });
		const vw = bold.widthOfTextAtSize(value, 11);
		const maxRight = width - M;
		// right-align, shrink if too wide
		let size = 11;
		let w = vw;
		while (w > maxRight - (M + 90) && size > 8) {
			size -= 0.5;
			w = bold.widthOfTextAtSize(value, size);
		}
		page.drawText(value, {
			x: maxRight - w,
			y,
			size,
			font: bold,
			color: NAVY,
		});
		page.drawLine({
			start: { x: M, y: y - 10 },
			end: { x: width - M, y: y - 10 },
			thickness: 1,
			color: LINE,
		});
		y -= rowH;
	}

	// Footer note
	y -= 6;
	const note = "Please bring your ID and required documents";
	const nw = font.widthOfTextAtSize(note, 9);
	page.drawText(note, { x: cx - nw / 2, y, size: 9, font, color: MUTED });
	y -= 12;
	const note2 = "on the day of your appointment.";
	const n2w = font.widthOfTextAtSize(note2, 9);
	page.drawText(note2, { x: cx - n2w / 2, y, size: 9, font, color: MUTED });

	// Bottom accent
	page.drawRectangle({
		x: 0,
		y: 0,
		width,
		height: 6,
		color: rgb(0.18, 0.88, 0.81),
	});

	return doc.save();
}
