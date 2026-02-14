"use client";

import OnboardingWizard from "@/components/OnboardingWizard";
import {Info, Lock, ShieldCheck} from "lucide-react";

export default function OnboardingPage() {
    return (
        <div className="flex flex-col min-h-[calc(100vh-64px)] bg-[#fafafa]">

            {/* 1. Contextual Header (Minimal) */}
            <section className="w-full pt-8 pb-4 px-6">
                <div className="max-w-xl mx-auto flex items-center justify-between border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <ShieldCheck className="w-5 h-5 text-blue-600"/>
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900">Secure Verification</h2>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                                Session ID: <span className="text-slate-900">HC-882-01</span>
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

            {/* 2. The Wizard Component */}
            <section className="grow flex items-center justify-center px-4 py-8">
                <OnboardingWizard/>
            </section>

            {/* 3. Helpful Tooltip / Note */}
            <section className="w-full pb-10 px-6">
                <div className="max-w-md mx-auto bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3">
                    <Info className="w-5 h-5 text-blue-500 shrink-0"/>
                    <p className="text-xs text-blue-700 leading-relaxed">
                        <strong>Tip:</strong> Ensure you are in a well-lit environment for the selfie capture.
                        If you lose connection, your progress will be saved automatically for offline sync.
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