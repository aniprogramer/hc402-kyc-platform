"use client";

import React from "react";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {ArrowRight, Database, Lock, RefreshCw, Server, Smartphone, WifiOff} from "lucide-react";
import Link from "next/link";
import {cn} from "@/lib/utils";

export default function HomePage() {
    return (
        <main className="relative bg-[#fafafa] text-slate-900 selection:bg-blue-100 overflow-x-hidden pb-safe">

            {/* --- HERO SECTION --- */}
            <section className="relative pt-12 pb-16 md:pt-32 md:pb-40 px-4">
                <div
                    className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_50%,rgba(59,130,246,0.08)_0%,rgba(255,255,255,0)_100%)]"/>

                <div className="max-w-7xl mx-auto text-center px-2">
                    <Badge variant="secondary"
                           className="mb-6 py-1 px-4 rounded-full bg-blue-50 text-blue-700 border-blue-100">
                        Next-Gen PWA • HC-402 Protocol
                    </Badge>

                    <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter text-slate-900 mb-6 leading-[1.05]">
                        Verify Identity <br className="hidden sm:block"/>
                        <span
                            className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500">
              Anywhere. Offline.
            </span>
                    </h1>

                    <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-medium px-2">
                        The industry's first offline-first KYC solution. High-speed OCR, biometric matching,
                        and background sync—packaged into a lightweight installable app.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
                        <Link href="/onboarding" className="w-full sm:w-auto">
                            <Button size="lg"
                                    className="w-full h-14 md:h-16 px-10 text-lg rounded-2xl shadow-xl bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all">
                                Launch Verification <ArrowRight className="ml-2 w-5 h-5"/>
                            </Button>
                        </Link>
                        <Button variant="outline" size="lg"
                                className="w-full sm:w-auto h-14 md:h-16 px-10 text-lg rounded-2xl border-2 bg-white active:scale-95">
                            Technical Docs
                        </Button>
                    </div>
                </div>
            </section>

            {/* --- BENTO FEATURE GRID --- */}
            <section id="features" className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 auto-rows-min md:auto-rows-[220px]">

                    {/* Featured: Offline Support */}
                    <Card
                        className="md:col-span-8 md:row-span-2 bg-slate-900 text-white border-none overflow-hidden relative group min-h-[320px]">
                        <CardContent className="p-8 md:p-12 flex flex-col h-full justify-between">
                            <div className="z-10">
                                <div
                                    className="w-12 h-12 md:w-14 md:h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                                    <WifiOff className="text-blue-400 w-6 h-6 md:w-7 md:h-7"/>
                                </div>
                                <h3 className="text-3xl md:text-4xl font-bold mb-4">Offline Resilience</h3>
                                <p className="text-slate-400 text-base md:text-lg max-w-md leading-relaxed">
                                    Data is cached securely using <span
                                    className="text-white font-semibold">IndexedDB</span> and synced automatically when
                                    back online.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2 z-10 mt-6">
                                <Badge className="bg-white/10 text-white border-none py-1 px-3 rounded-lg text-xs">Background
                                    Sync</Badge>
                                <Badge
                                    className="bg-white/10 text-white border-none py-1 px-3 rounded-lg text-xs">AES-256</Badge>
                            </div>
                            <div
                                className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"/>
                        </CardContent>
                    </Card>

                    <FeatureCard
                        icon={<Smartphone className="text-blue-600 w-6 h-6"/>}
                        title="Native Feel"
                        desc="Full-screen standalone experience on iOS & Android."
                    />
                    <FeatureCard
                        icon={<Lock className="text-blue-600 w-6 h-6"/>}
                        title="Privacy First"
                        desc="On-device encryption ensures your PII remains private."
                    />

                    <Card
                        className="md:col-span-4 md:row-span-1 bg-blue-600 text-white border-none group overflow-hidden">
                        <CardContent className="p-6 md:p-8 flex flex-col justify-center h-full">
                            <RefreshCw
                                className="text-white w-7 h-7 mb-4 group-hover:rotate-180 transition-transform duration-700"/>
                            <h3 className="text-xl font-bold mb-1">Live AI Match</h3>
                            <p className="text-blue-100 text-sm">Biometric matching with 99.8% accuracy.</p>
                        </CardContent>
                    </Card>

                    <FeatureCard
                        icon={<Database className="text-blue-600 w-6 h-6"/>}
                        title="Instant OCR"
                        desc="Extract data from global IDs in milliseconds."
                    />
                    <FeatureCard
                        icon={<Server className="text-blue-600 w-6 h-6"/>}
                        title="Admin Panel"
                        desc="Powerful backend for manual auditing and review."
                    />
                </div>
            </section>

            {/* --- VISUAL PROCESS FLOW --- */}
            <section className="py-16 bg-slate-50 border-y border-slate-200 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">The Verification Lifecycle</h2>
                        <p className="text-slate-500 max-w-md mx-auto text-sm">A seamless, mobile-first identity
                            verification flow.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {steps.map((step, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center">
                                <div
                                    className="w-14 h-14 rounded-full bg-white border-4 border-blue-100 flex items-center justify-center text-blue-600 font-black text-xl mb-4 shadow-sm">
                                    {idx + 1}
                                </div>
                                <h4 className="text-lg font-bold mb-1">{step.title}</h4>
                                <p className="text-slate-500 text-xs leading-relaxed px-4">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FINAL CTA SECTION --- */}
            <section className="py-16 md:py-28 max-w-7xl mx-auto px-4 md:px-6">
                <div
                    className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-24 text-white text-center relative overflow-hidden shadow-2xl shadow-blue-200/50">

                    <div className="relative z-10">
                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-6 md:mb-10 leading-tight tracking-tighter">
                            Ready to integrate?
                        </h2>
                        <p className="text-blue-100 text-base md:text-xl max-w-2xl mx-auto mb-10 md:mb-14 opacity-90 font-medium px-4">
                            Join dozens of developers using HC-402 to build secure,
                            identity-first applications for the modern mobile web.
                        </p>

                        <Link href="/onboarding" className="inline-block w-full sm:w-auto">
                            <Button
                                size="lg"
                                className={cn(
                                    // Responsive Width: Full on mobile, fixed/min-width on desktop
                                    "w-full sm:min-w-[280px] md:min-w-[320px]",
                                    // Responsive Height: 56px -> 64px -> 80px
                                    "h-14 md:h-16 lg:h-20",
                                    // Responsive Typography
                                    "text-base md:text-lg lg:text-xl font-black uppercase tracking-tight",
                                    "rounded-2xl md:rounded-3xl",
                                    "bg-white text-blue-700 hover:bg-slate-100",
                                    "transition-all duration-300 hover:scale-[1.05] active:scale-95 shadow-xl shadow-black/10"
                                )}
                            >
                                Get Started Now
                            </Button>
                        </Link>
                    </div>

                    {/* Decorative elements - scaled down for mobile */}
                    <div
                        className="absolute top-0 left-0 w-32 h-32 md:w-64 md:h-64 bg-white/10 blur-[60px] md:blur-[100px] -translate-x-1/2 -translate-y-1/2"/>
                    <div
                        className="absolute bottom-0 right-0 w-40 h-40 md:w-80 md:h-80 bg-blue-400/20 blur-[80px] md:blur-[120px] translate-x-1/4 translate-y-1/4"/>
                </div>
            </section>
        </main>
    );
}

function FeatureCard({icon, title, desc}: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <Card
            className="md:col-span-4 md:row-span-1 bg-white border-slate-200/60 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6 md:p-8 flex flex-col justify-center h-full">
                <div className="mb-4">{icon}</div>
                <h3 className="text-lg md:text-xl font-bold mb-1">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </CardContent>
        </Card>
    );
}

const steps = [
    {title: "Initialization", desc: "User starts onboarding with biometric consent."},
    {title: "ID Capture", desc: "OCR engine scans and validates documents."},
    {title: "Liveness", desc: "Front camera match ensures user is present."},
    {title: "Verdict", desc: "AI provides instant confidence scores."},
];