import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MobileGuard from "@/app/_components/MobileGuard";
import {
	ConfigProvider,
	type RuntimeConfig,
} from "@/app/_lib/runtime-config";

// The flow reads request-time params (?phone=) and cookies — never prerender.
export const dynamic = "force-dynamic";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "Huduma Centre — Book Appointment",
	description: "Book your Huduma Centre appointment securely.",
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	themeColor: "#1746e0",
};

function getRuntimeConfig(): RuntimeConfig {
	return {
		allowDesktopTesting: process.env.ALLOW_DESKTOP_TESTING === "true",
		whatsappNumber: process.env.WHATSAPP_NUMBER,
	};
}

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const config = getRuntimeConfig();
	return (
		<html lang="en" className={inter.variable}>
			<body className="min-h-dvh bg-white font-sans antialiased">
				<ConfigProvider config={config}>
					<MobileGuard>{children}</MobileGuard>
				</ConfigProvider>
			</body>
		</html>
	);
}
