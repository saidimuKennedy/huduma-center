"use client";

import { createContext, useContext, type ReactNode } from "react";

export interface RuntimeConfig {
	/** When true, MobileGuard is bypassed so the flow can be tested on desktop. */
	allowDesktopTesting: boolean;
	/** WhatsApp number the "sent to WhatsApp" copy references (display only). */
	whatsappNumber: string | undefined;
}

const ConfigContext = createContext<RuntimeConfig | null>(null);

export function ConfigProvider({
	config,
	children,
}: {
	config: RuntimeConfig;
	children: ReactNode;
}) {
	return (
		<ConfigContext.Provider value={config}>
			{children}
		</ConfigContext.Provider>
	);
}

export function useConfig(): RuntimeConfig {
	const config = useContext(ConfigContext);
	if (!config) {
		throw new Error("useConfig must be used within a ConfigProvider");
	}
	return config;
}
