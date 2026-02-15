"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface PwaContextType {
    isInstalled: boolean;
    deferredPrompt: any;
    installApp: () => Promise<void>;
    isPending: boolean;
}

const PwaContext = createContext<PwaContextType | undefined>(undefined);

export function PwaProvider({ children }: { children: React.ReactNode }) {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        // Check if already running as PWA
        const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
        const wasInstalledLocally = localStorage.getItem("pwa_installed") === "true";

        if (isStandalone || wasInstalledLocally) {
            setIsInstalled(true);
        }

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    }, []);

    const installApp = async () => {
        if (!deferredPrompt) return;
        setIsPending(true);

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
            setIsInstalled(true);
            localStorage.setItem("pwa_installed", "true");
        }

        setDeferredPrompt(null);
        setIsPending(false);
    };

    return (
        <PwaContext.Provider value={{ isInstalled, deferredPrompt, installApp, isPending }}>
            {children}
        </PwaContext.Provider>
    );
}

export const usePwa = () => {
    const context = useContext(PwaContext);
    if (!context) throw new Error("usePwa must be used within a PwaProvider");
    return context;
};