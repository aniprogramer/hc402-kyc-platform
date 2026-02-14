"use client";

import { ShieldCheck, CheckCircle2 } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full border-t bg-white py-10">
            <div className="max-w-5xl mx-auto px-6 flex flex-col items-center gap-6">

                {/* Trust Badges - Essential for KYC Demos */}
                <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                        <span>End-to-End Encrypted</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>GDPR Compliant</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>System Status: Optimal</span>
                    </div>
                </div>

                {/* Main Branding & Copyright */}
                <div className="text-center space-y-2">
                    <p className="text-sm font-semibold text-slate-900 flex items-center justify-center gap-2">
                        <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded text-[10px]">HC‑402</span>
                        Identity Protocol
                    </p>
                    <p className="text-xs text-slate-400">
                        © 2026 HC-402 KYC Platform · Built for Secure Identity Verification
                    </p>
                </div>

                {/* Minimal Links */}
                <div className="flex gap-6 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    <a href="#" className="hover:text-blue-600 transition">Privacy</a>
                    <a href="#" className="hover:text-blue-600 transition">Terms</a>
                    <a href="#" className="hover:text-blue-600 transition">Support</a>
                </div>
            </div>
        </footer>
    );
}