"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	BadgeCheck,
	User,
	IdCard,
	Phone,
	Mail,
	Briefcase,
	MapPin,
	Home,
	Calendar,
	Clock,
	ChevronDown,
} from "lucide-react";
import BookingShell from "@/app/_components/BookingShell";
import { PrimaryButton, Note } from "@/app/_components/ui";
import { usePhone } from "@/app/_lib/usePhone";
import { maskPhone, maskId, formatDate } from "@/app/_lib/format";
import {
	SERVICES,
	SERVICE_STATIONS,
	COUNTIES,
	TIME_SLOTS,
	upcomingDates,
} from "@/app/_lib/reference";
import { bookAppointment } from "@/app/actions/booking";
import type { CitizenProfile } from "@/app/_lib/types";

const DATES = upcomingDates();

function ProfileRow({
	icon: Icon,
	label,
	value,
}: {
	icon: React.ElementType;
	label: string;
	value: string;
}) {
	return (
		<div className="flex items-center gap-3 py-2.5">
			<Icon className="h-4 w-4 shrink-0 text-muted" />
			<span className="w-28 shrink-0 text-sm text-muted">{label}</span>
			<span className="flex-1 text-right text-sm font-medium text-ink">
				{value}
			</span>
		</div>
	);
}

function SelectField({
	icon: Icon,
	label,
	value,
	onChange,
	options,
	display,
}: {
	icon: React.ElementType;
	label: string;
	value: string;
	onChange: (v: string) => void;
	options: string[];
	display?: (v: string) => string;
}) {
	return (
		<div className="flex items-center gap-3 rounded-xl border border-line bg-white px-3.5 py-2 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand-tint">
			<Icon className="h-5 w-5 shrink-0 text-muted" />
			<div className="relative flex-1">
				<span className="block text-[10px] font-medium text-muted">
					{label}
				</span>
				<select
					value={value}
					onChange={e => onChange(e.target.value)}
					className="w-full appearance-none bg-transparent pr-6 text-sm font-medium text-ink outline-none"
				>
					{options.map(o => (
						<option key={o} value={o}>
							{display ? display(o) : o}
						</option>
					))}
				</select>
				<ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
			</div>
		</div>
	);
}

export default function ReviewForm({ profile }: { profile: CitizenProfile }) {
	const router = useRouter();
	const phone = usePhone();

	const [service, setService] = useState(SERVICES[0]);
	const [station, setStation] = useState(SERVICE_STATIONS[0]);
	const [county, setCounty] = useState(COUNTIES[0]);
	const [date, setDate] = useState(DATES[0]);
	const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function onConfirm() {
		setLoading(true);
		setError(null);
		const res = await bookAppointment({
			service,
			serviceStation: station,
			county,
			date,
			timeSlot,
		});
		setLoading(false);
		if (!res.success) {
			setError(res.error ?? "Could not confirm. Please try again.");
			return;
		}
		const q = phone ? `?phone=${encodeURIComponent(phone)}` : "";
		router.push(`/confirmed${q}`);
	}

	return (
		<BookingShell current="review" footerLabel="Ready to book">
			<h2 className="text-center text-2xl font-bold text-navy">
				Review your details
			</h2>
			<div className="mt-3 flex justify-center">
				<span className="inline-flex items-center gap-1.5 rounded-full bg-success-tint px-3 py-1 text-xs font-semibold text-success">
					<BadgeCheck className="h-4 w-4" />
					Identity verified
				</span>
			</div>

			{/* Verified profile (rendered server-side from the session) */}
			<div className="mt-4 divide-y divide-line rounded-2xl border border-line bg-white px-4">
				<ProfileRow icon={User} label="Full Name" value={profile.fullName} />
				<ProfileRow
					icon={IdCard}
					label="ID Number"
					value={maskId(profile.idNumber)}
				/>
				<ProfileRow
					icon={Phone}
					label="Phone Number"
					value={maskPhone(profile.phone)}
				/>
				<ProfileRow
					icon={Mail}
					label="Email"
					value={profile.email || "—"}
				/>
			</div>

			<h3 className="mt-6 mb-3 text-sm font-bold text-navy">
				Appointment Details
			</h3>
			<div className="flex flex-col gap-3">
				<SelectField
					icon={Briefcase}
					label="Service"
					value={service}
					onChange={setService}
					options={SERVICES}
				/>
				<SelectField
					icon={MapPin}
					label="Service Station"
					value={station}
					onChange={setStation}
					options={SERVICE_STATIONS}
				/>
				<SelectField
					icon={Home}
					label="County of Residence"
					value={county}
					onChange={setCounty}
					options={COUNTIES}
				/>
				<SelectField
					icon={Calendar}
					label="Preferred Date"
					value={date}
					onChange={setDate}
					options={DATES}
					display={formatDate}
				/>
				<SelectField
					icon={Clock}
					label="Time Slot"
					value={timeSlot}
					onChange={setTimeSlot}
					options={TIME_SLOTS}
				/>
			</div>

			<div className="mt-4">
				<Note variant="info">
					Please confirm that your details and appointment information
					are correct.
				</Note>
			</div>

			{error && (
				<p className="mt-3 text-center text-sm text-red-600">{error}</p>
			)}

			<div className="mt-6">
				<PrimaryButton onClick={onConfirm} loading={loading}>
					Confirm Appointment
				</PrimaryButton>
			</div>
		</BookingShell>
	);
}
