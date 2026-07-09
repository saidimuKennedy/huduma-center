"use client";

import { useEffect, useState } from "react";
import { Smartphone } from "lucide-react";
import { useConfig } from "@/app/_lib/runtime-config";

/**
 * The flow is delivered as a WhatsApp webview and is meant to be completed on
 * the recipient's phone. Block desktop browsers unless testing is enabled.
 */
export default function MobileGuard({
	children,
}: {
	children: React.ReactNode;
}) {
	const { allowDesktopTesting } = useConfig();
	const [isMobile, setIsMobile] = useState<boolean | null>(null);

	useEffect(() => {
		const check = () => {
			if (allowDesktopTesting) {
				setIsMobile(true);
				return;
			}
			const ua = (
				navigator.userAgent ||
				navigator.vendor ||
				""
			).toLowerCase();
			const isMobileUA =
				/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
					ua,
				);
			setIsMobile(isMobileUA || window.innerWidth <= 768);
		};
		check();
		window.addEventListener("resize", check);
		return () => window.removeEventListener("resize", check);
	}, [allowDesktopTesting]);

	if (isMobile === null) {
		return (
			<div className="flex min-h-dvh items-center justify-center bg-white">
				<div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-brand" />
			</div>
		);
	}

	if (!isMobile) {
		return (
			<div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-surface p-8 text-center">
				<div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-tint">
					<Smartphone className="h-10 w-10 text-brand" />
				</div>
				<h1 className="text-xl font-bold text-navy">
					Open on your phone
				</h1>
				<p className="max-w-sm text-muted">
					This Huduma service is designed for mobile. Please open the
					link from WhatsApp on your smartphone to continue.
				</p>
			</div>
		);
	}

	return <>{children}</>;
}
