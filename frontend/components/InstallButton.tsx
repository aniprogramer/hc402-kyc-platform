"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function InstallButton() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Capture install prompt
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener("beforeinstallprompt", handler);

        // Detect if app is already installed
        window.addEventListener("appinstalled", () => {
            setIsInstalled(true);
            setDeferredPrompt(null);
        });

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
            window.removeEventListener("appinstalled", () => {});
        };
    }, []);

    async function handleInstall() {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === "accepted") {
            console.log("User accepted the install prompt");
        } else {
            console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null);
    }

    // Hide button if installed
    if (isInstalled) return null;

    return (
        <Button onClick={handleInstall} disabled={!deferredPrompt}>
            Install App
        </Button>
    );
}