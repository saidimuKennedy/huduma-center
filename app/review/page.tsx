import { redirect } from "next/navigation";
import { getSession } from "@/app/_lib/session";
import ReviewForm from "./ReviewForm";

export default async function ReviewPage() {
	// Gate: only reachable with a verified session (set after OTP).
	const session = await getSession();
	if (!session) {
		redirect("/");
	}
	return <ReviewForm profile={session} />;
}
