"use client";

import {usePwa} from "@/context/PwaContext";
import {Button} from "@/components/ui/button";
import {Check, Download} from "lucide-react";
import {cn} from "@/lib/utils";

export default function InstallButton() {
    const {isInstalled, deferredPrompt, installApp, isPending} = usePwa();

    if (isInstalled) {
        return (
            <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Check className="w-3.5 h-3.5"/>
                <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">Active</span>
            </div>
        );
    }

    if (!deferredPrompt) return null;

    return (
        <Button
            onClick={installApp}
            disabled={isPending}
            className={cn(
                "transition-all active:scale-90 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100",
                "h-9 w-9 p-0 rounded-full md:w-auto md:px-5 md:rounded-full" // Circle on mobile, Pill on desktop
            )}
        >
            {isPending ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"/>
            ) : (
                <div className="flex items-center gap-2">
                    <Download className="w-4 h-4"/>
                    <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest">
                        Install App
                    </span>
                </div>
            )}
        </Button>
    );
}