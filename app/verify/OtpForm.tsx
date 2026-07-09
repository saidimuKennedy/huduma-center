"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, BadgeCheck, RotateCw } from "lucide-react";
import BookingShell from "@/app/_components/BookingShell";
import { PrimaryButton, SecondaryButton, ButtonRow, Note } from "@/app/_components/ui";
import { usePhone } from "@/app/_lib/usePhone";
import { verifyOtp, generateOtp } from "@/app/actions/otp";

const OTP_LENGTH = 6;
const EXPIRY_SECONDS = 120;

function formatCountdown(s: number): string {
	const m = Math.floor(s / 60);
	const sec = s % 60;
	return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function OtpForm({ maskedPhone }: { maskedPhone: string }) {
	const router = useRouter();
	const phone = usePhone();
	const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
	const [remaining, setRemaining] = useState(EXPIRY_SECONDS);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const inputs = useRef<(HTMLInputElement | null)[]>([]);

	const code = digits.join("");
	const complete = code.length === OTP_LENGTH;

	useEffect(() => {
		if (remaining <= 0) return;
		const t = setTimeout(() => setRemaining(r => r - 1), 1000);
		return () => clearTimeout(t);
	}, [remaining]);

	useEffect(() => {
		inputs.current[0]?.focus();
	}, []);

	function setDigit(i: number, value: string) {
		// Pesaflow codes are uppercase alphanumeric — keep letters and digits.
		const v = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
		setError(null);
		if (v.length > 1) {
			// paste
			const next = [...digits];
			for (let k = 0; k < v.length && i + k < OTP_LENGTH; k++) {
				next[i + k] = v[k];
			}
			setDigits(next);
			const last = Math.min(i + v.length, OTP_LENGTH - 1);
			inputs.current[last]?.focus();
			return;
		}
		const next = [...digits];
		next[i] = v;
		setDigits(next);
		if (v && i < OTP_LENGTH - 1) inputs.current[i + 1]?.focus();
	}

	function onKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Backspace" && !digits[i] && i > 0) {
			inputs.current[i - 1]?.focus();
		}
	}

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!complete || loading) return;
		setLoading(true);
		const res = await verifyOtp(code);
		setLoading(false);
		if (!res.success) {
			setError(res.error ?? "Invalid code. Please try again.");
			return;
		}
		const q = phone ? `?phone=${encodeURIComponent(phone)}` : "";
		router.push(`/review${q}`);
	}

	function goBack() {
		const q = phone ? `?phone=${encodeURIComponent(phone)}` : "";
		router.push(`/book${q}`);
	}

	async function onResend() {
		setError(null);
		setDigits(Array(OTP_LENGTH).fill(""));
		setRemaining(EXPIRY_SECONDS);
		inputs.current[0]?.focus();
		const res = await generateOtp(phone);
		if (!res.success) {
			setError(res.error ?? "Couldn't resend the code.");
		}
	}

	return (
		<BookingShell
			current="otp"
			footerLabel="Phone verification"
			onBack={goBack}
		>
			<form onSubmit={onSubmit} className="flex flex-1 flex-col">
				<div className="mt-2 flex justify-center">
					<div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-tint">
						<LockKeyhole className="h-9 w-9 text-brand" />
						<span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-success text-white ring-4 ring-white">
							<BadgeCheck className="h-4 w-4" />
						</span>
					</div>
				</div>

				<h2 className="mt-5 text-center text-2xl font-bold text-navy">
					Enter verification code
				</h2>
				<p className="mt-2 text-center text-sm leading-relaxed text-muted">
					We sent a 6-character code to{" "}
					<span className="font-semibold text-ink">{maskedPhone}</span>
					. Enter it below to continue.
				</p>

				<div className="mt-7 flex justify-between gap-2">
					{digits.map((d, i) => (
						<input
							key={i}
							ref={el => {
								inputs.current[i] = el;
							}}
							type="text"
							inputMode="text"
							autoCapitalize="characters"
							autoComplete={i === 0 ? "one-time-code" : "off"}
							maxLength={i === 0 ? OTP_LENGTH : 1}
							value={d}
							onChange={e => setDigit(i, e.target.value)}
							onKeyDown={e => onKeyDown(i, e)}
							className="h-14 w-full rounded-xl border border-line bg-white text-center text-xl font-semibold uppercase text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand-tint"
						/>
					))}
				</div>

				<div className="mt-4 flex flex-col items-center gap-2">
					<span className="text-xs text-muted">
						{remaining > 0
							? `Code expires in ${formatCountdown(remaining)}`
							: "Code expired"}
					</span>
					<button
						type="button"
						onClick={onResend}
						className="flex items-center gap-1.5 text-sm font-semibold text-brand"
					>
						<RotateCw className="h-4 w-4" />
						Resend OTP
					</button>
					<button
						type="button"
						onClick={goBack}
						className="text-sm font-semibold text-brand"
					>
						Wrong phone number?
					</button>
				</div>

				{error && (
					<p className="mt-3 text-center text-sm text-red-600">
						{error}
					</p>
				)}

				<div className="mt-6">
					<Note variant="success">
						Your ID details have been found and are ready for
						validation after OTP verification.
					</Note>
				</div>

				<div className="mt-auto pt-8">
					<ButtonRow>
						<SecondaryButton
							type="button"
							onClick={goBack}
							className="flex-1"
						>
							Back
						</SecondaryButton>
						<PrimaryButton
							type="submit"
							loading={loading}
							disabled={!complete}
							className="flex-1"
						>
							Proceed
						</PrimaryButton>
					</ButtonRow>
				</div>
			</form>
		</BookingShell>
	);
}
