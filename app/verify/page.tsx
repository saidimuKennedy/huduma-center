import { redirect } from "next/navigation";
import { getPending } from "@/app/_lib/session";
import { maskPhone } from "@/app/_lib/format";
import OtpForm from "./OtpForm";

export default async function VerifyOtpPage() {
	const pending = await getPending();
	if (!pending) {
		// No lookup in progress — send them back to identity.
		redirect("/");
	}
	return <OtpForm maskedPhone={maskPhone(pending.phone)} />;
}
