import { redirect } from "next/navigation";
import {
	CheckCircle2,
	User,
	Briefcase,
	MapPin,
	Calendar,
	Clock,
	Info,
} from "lucide-react";
import BookingShell from "@/app/_components/BookingShell";
import { getBooking } from "@/app/actions/booking";
import { formatDate } from "@/app/_lib/format";
import ConfirmedActions from "./ConfirmedActions";

function SummaryRow({
	icon: Icon,
	label,
	value,
}: {
	icon: React.ElementType;
	label: string;
	value: string;
}) {
	return (
		<div className="flex items-center gap-3 py-3">
			<Icon className="h-4 w-4 shrink-0 text-muted" />
			<span className="flex-1 text-sm text-muted">{label}</span>
			<span className="text-right text-sm font-semibold text-ink">
				{value}
			</span>
		</div>
	);
}

export default async function ConfirmedPage() {
	const booking = await getBooking();
	if (!booking) {
		redirect("/");
	}

	return (
		<BookingShell current="confirm" footerLabel="Booking complete">
			<div className="mt-2 flex justify-center">
				<div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-tint">
					<CheckCircle2 className="h-9 w-9 text-success" />
				</div>
			</div>

			<h2 className="mt-4 text-center text-2xl font-bold text-navy">
				Appointment confirmed
			</h2>
			<p className="mt-2 text-center text-sm text-muted">
				Your appointment has been successfully booked.
			</p>

			{/* Ticket */}
			<div className="mt-5 rounded-2xl border border-dashed border-line bg-white px-4 py-4 text-center">
				<span className="text-xs font-medium text-muted">
					Ticket Number
				</span>
				<div className="mt-1 text-2xl font-extrabold tracking-wide text-success">
					{booking.ticketNumber}
				</div>
			</div>

			{/* Summary */}
			<div className="mt-4 divide-y divide-line rounded-2xl border border-line bg-white px-4">
				<SummaryRow icon={User} label="Name" value={booking.fullName} />
				<SummaryRow
					icon={Briefcase}
					label="Service"
					value={booking.service}
				/>
				<SummaryRow
					icon={MapPin}
					label="Service Station"
					value={booking.serviceStation}
				/>
				<SummaryRow
					icon={Calendar}
					label="Date"
					value={formatDate(booking.date)}
				/>
				<SummaryRow
					icon={Clock}
					label="Time"
					value={booking.timeSlot}
				/>
			</div>

			<ConfirmedActions booking={booking} />

			<div className="mt-4 flex items-start gap-2 rounded-xl bg-brand-tint px-3.5 py-3 text-sm text-brand-dark">
				<Info className="mt-0.5 h-4 w-4 shrink-0" />
				<span className="leading-snug">
					Please bring your ID and required documents on the
					appointment day.
				</span>
			</div>
		</BookingShell>
	);
}
