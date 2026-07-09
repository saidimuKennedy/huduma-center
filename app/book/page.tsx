"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, IdCard, UserCheck } from "lucide-react";
import BookingShell from "@/app/_components/BookingShell";
import { PrimaryButton, SecondaryButton, ButtonRow, Note, FieldLabel } from "@/app/_components/ui";
import { usePhone } from "@/app/_lib/usePhone";
import { isValidNationalId, maskId } from "@/app/_lib/format";
import { lookupCitizen } from "@/app/actions/lookup";
import { generateOtp } from "@/app/actions/otp";

export default function VerifyIdentityPage() {
	const router = useRouter();
	const phone = usePhone();
	const [idNumber, setIdNumber] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	// Once the lookup resolves, we hold the found name here and ask the user to
	// confirm it is them before sending the OTP.
	const [found, setFound] = useState<{ name: string; masked: string } | null>(
		null,
	);
	const [sending, setSending] = useState(false);

	const canSubmit = isValidNationalId(idNumber) && !loading;
	const phoneQ = phone ? `?phone=${encodeURIComponent(phone)}` : "";

	async function onLookup(e: React.FormEvent) {
		e.preventDefault();
		if (!canSubmit) return;
		setError(null);
		setLoading(true);
		const res = await lookupCitizen(idNumber, phone);
		setLoading(false);
		if (!res.success) {
			setError(res.error ?? "Something went wrong. Please try again.");
			return;
		}
		setFound({
			name: res.fullName ?? "Citizen",
			masked: res.maskedPhone ?? "",
		});
	}

	async function onContinue() {
		setError(null);
		setSending(true);
		const res = await generateOtp(phone);
		setSending(false);
		if (!res.success) {
			setError(res.error ?? "Couldn't send the code. Please try again.");
			return;
		}
		router.push(`/verify${phoneQ}`);
	}

	function reset() {
		setFound(null);
		setIdNumber("");
		setError(null);
	}

	return (
		<BookingShell
			current="identity"
			footerLabel="Secure verification"
			onBack={found ? reset : () => router.push(`/${phoneQ}`)}
		>
			{found ? (
				// ── Identity found: confirm the resolved name ──
				<div className="flex flex-1 flex-col">
					<div className="mt-2 flex justify-center">
						<div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-success-tint">
							<UserCheck className="h-9 w-9 text-success" />
						</div>
					</div>
					<h2 className="mt-5 text-center text-2xl font-bold text-navy">
						We found your record
					</h2>
					<p className="mt-2 text-center text-sm leading-relaxed text-muted">
						Confirm this is you. Your details come directly from the
						national register.
					</p>

					<div className="mt-6 rounded-2xl border border-line bg-white p-4">
						<div className="flex items-center gap-3">
							<div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-tint text-base font-bold text-brand">
								{found.name.charAt(0).toUpperCase()}
							</div>
							<div className="min-w-0">
								<p className="truncate text-base font-bold text-ink">
									{found.name}
								</p>
								<p className="text-sm text-muted">
									ID {maskId(idNumber)}
								</p>
							</div>
							<BadgeCheck className="ml-auto h-6 w-6 text-success" />
						</div>
					</div>

					<div className="mt-4">
						<Note variant="success">
							{`We'll send a one-time code to ${found.masked} to confirm it's you.`}
						</Note>
					</div>

					{error && (
						<p className="mt-4 text-center text-sm text-red-600">
							{error}
						</p>
					)}

					<div className="mt-auto pt-8">
						<ButtonRow>
							<SecondaryButton type="button" onClick={reset} className="flex-1">
								Back
							</SecondaryButton>
							<PrimaryButton
								onClick={onContinue}
								loading={sending}
								className="flex-1"
							>
								Proceed
							</PrimaryButton>
						</ButtonRow>
						<button
							type="button"
							onClick={reset}
							className="mt-3 w-full text-center text-sm font-medium text-muted"
						>
							Not you? Use a different ID
						</button>
					</div>
				</div>
			) : (
				// ── Enter National ID ──
				<form onSubmit={onLookup} className="flex flex-1 flex-col">
					<div className="mt-2 flex justify-center">
						<div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-tint">
							<IdCard className="h-9 w-9 text-brand" />
							<span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-success text-white ring-4 ring-white">
								<BadgeCheck className="h-4 w-4" />
							</span>
						</div>
					</div>

					<h2 className="mt-5 text-center text-2xl font-bold text-navy">
						Verify your identity
					</h2>
					<p className="mt-2 text-center text-sm leading-relaxed text-muted">
						Enter your ID number to receive a one-time code on your
						registered phone.
					</p>

					<div className="mt-7">
						<FieldLabel>National ID Number</FieldLabel>
						<div className="flex items-center gap-2 rounded-xl border border-line bg-white px-3.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand-tint">
							<IdCard className="h-5 w-5 shrink-0 text-muted" />
							<input
								type="number"
								inputMode="numeric"
								autoComplete="off"
								value={idNumber}
								onChange={e => {
									setIdNumber(e.target.value);
									setError(null);
								}}
								placeholder="Enter ID number"
								className="h-13 w-full bg-transparent text-base text-ink outline-none placeholder:text-muted/70"
							/>
						</div>
						{error && (
							<p className="mt-2 text-sm text-red-600">{error}</p>
						)}
					</div>

					<div className="mt-4">
						<Note variant="success">
							We will send an OTP to the phone linked to this ID.
						</Note>
					</div>

					<div className="mt-auto pt-8">
						<ButtonRow>
							<SecondaryButton
								type="button"
								onClick={() => router.push(`/${phoneQ}`)}
								className="flex-1"
							>
								Back
							</SecondaryButton>
							<PrimaryButton
								type="submit"
								loading={loading}
								disabled={!canSubmit}
								className="flex-1"
							>
								Proceed
							</PrimaryButton>
						</ButtonRow>
						<button
							type="button"
							className="mt-3 w-full text-center text-sm font-medium text-muted"
						>
							Need help?
						</button>
					</div>
				</form>
			)}
		</BookingShell>
	);
}
