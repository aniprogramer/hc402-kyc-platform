"use client";

import {useSession} from "next-auth/react";
import {redirect} from "next/navigation";
import OnboardingWizard from "@/components/OnboardingWizard";
import {Info, Loader2, Lock, ShieldCheck} from "lucide-react";

export default function OnboardingPage() {
    // 1. Hook into the secure session
    const {data: session, status} = useSession();

    // 2. Handle Loading State
    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin"/>
            </div>
        );
    }

    // 3. Handle Unauthorized access
    if (status === "unauthenticated") {
        redirect("/login");
    }

    // Get the kycId from the secure session token
    const kycId = (session?.user as any)?.id || "PENDING";

    return (
        <div className="flex flex-col min-h-[calc(100vh-64px)] bg-[#fafafa]">

            {/* 1. Contextual Header (Dynamic) */}
            <section className="w-full pt-8 pb-4 px-6">
                <div className="max-w-xl mx-auto flex items-center justify-between border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <ShieldCheck className="w-5 h-5 text-blue-600"/>
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900">
                                {session?.user?.name ? `${session.user.name}'s Verification` : "Secure Verification"}
                            </h2>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                                {/* Use real kycId from session here */}
                                Session ID: <span className="text-slate-900 font-mono">{kycId}</span>
                            </p>
                        </div>
                    </div>

                    <div
                        className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                        <Lock className="w-3 h-3"/>
                        <span className="text-[10px] font-bold uppercase tracking-tighter">Encrypted</span>
                    </div>
                </div>
            </section>

            {/* 2. The Wizard Component (Pass kycId down) */}
            <section className="grow flex items-center justify-center px-4 py-8">
                <OnboardingWizard kycId={kycId}/>
            </section>

            {/* 3. Helpful Tooltip / Note */}
            <section className="w-full pb-10 px-6">
                <div className="max-w-md mx-auto bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3">
                    <Info className="w-5 h-5 text-blue-500 shrink-0"/>
                    <p className="text-xs text-blue-700 leading-relaxed">
                        <strong>Tip:</strong> Ensure you are in a well-lit environment for the selfie capture.
                        Your session is protected and tied to your account.
                    </p>
                </div>
            </section>

            {/* Subtle Background Decoration */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div
                    className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/30 blur-[120px] rounded-full"/>
                <div
                    className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/20 blur-[120px] rounded-full"/>
            </div>
        </div>
    );
}