// Canonical 4-step booking flow. Order matches the process-flow document.
export const STEPS = [
	{ key: "identity", label: "Verify Identity", short: "Identity" },
	{ key: "otp", label: "Verify OTP", short: "OTP" },
	{ key: "review", label: "Review & Select", short: "Details" },
	{ key: "confirm", label: "Confirm", short: "Confirm" },
] as const;

export type StepKey = (typeof STEPS)[number]["key"];

export const TOTAL_STEPS = STEPS.length;

/** 1-based index of a step, for "n/4" progress. */
export function stepNumber(key: StepKey): number {
	return STEPS.findIndex(s => s.key === key) + 1;
}
