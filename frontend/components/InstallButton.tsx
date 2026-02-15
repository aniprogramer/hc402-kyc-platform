"use client";

import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Check, Download, Sparkles} from "lucide-react";
import {cn} from "@/lib/utils";

export default function InstallButton() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        // 1. Check if already in standalone mode (Standard PWA check)
        const isStandalone = window.matchMedia("(display-mode: standalone)").matches;

        // 2. Check LocalStorage (Our persistent fallback)
        const wasInstalledLocally = localStorage.getItem("pwa_installed") === "true";

        if (isStandalone || wasInstalledLocally) {
            setIsInstalled(true);
            // If we are in standalone but haven't saved to localStorage yet, save it
            if (isStandalone && !wasInstalledLocally) {
                localStorage.setItem("pwa_installed", "true");
            }
        }

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        setIsPending(true);
        await deferredPrompt.prompt();

        const {outcome} = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
            setIsInstalled(true);
            // 3. PERSISTENCE: Save to localStorage so it stays "Installed" forever
            localStorage.setItem("pwa_installed", "true");
        }

        setDeferredPrompt(null);
        setIsPending(false);
    };

    // ALWAYS SHOW "App Installed" if state is true
    if (isInstalled) {
        return (
            <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 animate-in fade-in zoom-in duration-500"
            >
                <Check className="w-3.5 h-3.5"/>
                <span className="text-[10px] font-bold uppercase tracking-wider">App Installed</span>
            </div>
        );
    }

    if (!deferredPrompt) return null;

    return (
        <Button
            onClick={handleInstall}
            disabled={isPending}
            size="sm"
            className={cn(
                "relative h-9 rounded-full px-4 font-bold transition-all duration-300",
                "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200",
                "active:scale-95 overflow-hidden"
            )}
        >
            {isPending ? (
                <span className="flex items-center gap-2">
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"/>
                    <span className="text-xs">Installing...</span>
                </span>
            ) : (
                <span className="flex items-center gap-2">
                    <Download className="w-3.5 h-3.5"/>
                    <span className="text-xs">Install App</span>
                    <Sparkles className="w-3 h-3 text-blue-200 animate-pulse"/>
                </span>
            )}
        </Button>
    );
}

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}