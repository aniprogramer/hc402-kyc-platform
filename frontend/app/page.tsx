"use client";

import React from "react";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {ArrowRight, Database, Lock, RefreshCw, Server, Smartphone, WifiOff} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
    return (
        <main className="relative bg-[#fafafa] text-slate-900 selection:bg-blue-100 overflow-x-hidden">

            {/* --- HERO SECTION --- */}
            <section className="relative pt-20 pb-24 md:pt-32 md:pb-40">
                {/* Background Glow */}
                <div
                    className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_50%,rgba(59,130,246,0.08)_0%,rgba(255,255,255,0)_100%)]"/>

                <div className="max-w-7xl mx-auto px-6 text-center">
                    <Badge variant="secondary"
                           className="mb-6 py-1 px-4 rounded-full bg-blue-50 text-blue-700 border-blue-100 animate-in fade-in slide-in-from-bottom-3 duration-1000">
                        Next-Gen PWA • HC-402 Protocol
                    </Badge>

                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-slate-900 mb-8 leading-[1.1]">
                        Verify Identity <br/>
                        <span
                            className="bg-clip-text text-transparent bg-linear-to-r from-blue-600 via-indigo-600 to-blue-500">
              Anywhere. Offline.
            </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                        The industry's first offline-first KYC solution. High-speed OCR, biometric matching,
                        and background sync—packaged into a lightweight installable app.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/onboarding">
                            <Button size="lg"
                                    className="h-16 px-10 text-lg rounded-2xl shadow-2xl shadow-blue-200 bg-blue-600 hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-95">
                                Launch Verification <ArrowRight className="ml-2 w-5 h-5"/>
                            </Button>
                        </Link>
                        <Button variant="outline" size="lg"
                                className="h-16 px-10 text-lg rounded-2xl border-2 border-slate-200 bg-white hover:bg-slate-50">
                            Technical Docs
                        </Button>
                    </div>
                </div>
            </section>

            {/* --- BENTO FEATURE GRID --- */}
            <section id="features" className="py-20 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[220px]">

                    {/* Featured: Offline Support */}
                    <Card
                        className="md:col-span-8 md:row-span-2 bg-slate-900 text-white border-none overflow-hidden relative group">
                        <CardContent className="p-10 flex flex-col h-full justify-between">
                            <div className="z-10">
                                <div
                                    className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                                    <WifiOff className="text-blue-400 w-7 h-7"/>
                                </div>
                                <h3 className="text-4xl font-bold mb-4 tracking-tight">Offline Resilience</h3>
                                <p className="text-slate-400 text-lg max-w-md leading-relaxed">
                                    Engineered for remote environments. Your data is cached securely using
                                    <span className="text-white font-semibold"> IndexedDB </span>
                                    and synced via background workers when a connection is restored.
                                </p>
                            </div>
                            <div className="flex gap-3 z-10">
                                <Badge className="bg-white/10 text-white border-none py-1.5 px-4 rounded-lg">Background
                                    Sync</Badge>
                                <Badge className="bg-white/10 text-white border-none py-1.5 px-4 rounded-lg">Retry
                                    Logic</Badge>
                            </div>
                            <div
                                className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] group-hover:bg-blue-600/30 transition-all duration-700"/>
                        </CardContent>
                    </Card>

                    {/* Feature: PWA Install */}
                    <Card
                        className="md:col-span-4 md:row-span-1 bg-white border-slate-200/60 shadow-sm hover:shadow-xl transition-all border group">
                        <CardContent className="p-8">
                            <Smartphone
                                className="text-blue-600 w-8 h-8 mb-4 group-hover:scale-110 transition-transform"/>
                            <h3 className="text-xl font-bold mb-2">Native Feel</h3>
                            <p className="text-slate-500 text-sm">Install HC-402 on iOS/Android for a full-screen,
                                standalone experience with zero lag.</p>
                        </CardContent>
                    </Card>

                    {/* Feature: Security */}
                    <Card
                        className="md:col-span-4 md:row-span-1 bg-white border-slate-200/60 shadow-sm hover:shadow-xl transition-all border group">
                        <CardContent className="p-8">
                            <Lock className="text-blue-600 w-8 h-8 mb-4 group-hover:scale-110 transition-transform"/>
                            <h3 className="text-xl font-bold mb-2">Privacy First</h3>
                            <p className="text-slate-500 text-sm">On-device encryption ensures sensitive PII is never
                                exposed during transmission.</p>
                        </CardContent>
                    </Card>

                    {/* Feature: Live Face Match */}
                    <Card
                        className="md:col-span-4 md:row-span-1 bg-blue-600 text-white border-none shadow-xl shadow-blue-100 group">
                        <CardContent className="p-8">
                            <RefreshCw
                                className="text-white w-8 h-8 mb-4 group-hover:rotate-180 transition-transform duration-700"/>
                            <h3 className="text-xl font-bold mb-2">Live AI Match</h3>
                            <p className="text-blue-100 text-sm">Instant comparison between ID documents and live camera
                                capture with 99.8% accuracy.</p>
                        </CardContent>
                    </Card>

                    {/* Feature: OCR Engine */}
                    <Card
                        className="md:col-span-4 md:row-span-1 bg-white border-slate-200/60 shadow-sm hover:shadow-xl transition-all border group">
                        <CardContent className="p-8">
                            <Database
                                className="text-blue-600 w-8 h-8 mb-4 group-hover:scale-110 transition-transform"/>
                            <h3 className="text-xl font-bold mb-2">Instant OCR</h3>
                            <p className="text-slate-500 text-sm">Automated data extraction from global IDs, passports,
                                and driver licenses.</p>
                        </CardContent>
                    </Card>

                    {/* Feature: Dashboard */}
                    <Card
                        className="md:col-span-4 md:row-span-1 bg-white border-slate-200/60 shadow-sm hover:shadow-xl transition-all border group">
                        <CardContent className="p-8">
                            <Server className="text-blue-600 w-8 h-8 mb-4 group-hover:scale-110 transition-transform"/>
                            <h3 className="text-xl font-bold mb-2">Admin Panel</h3>
                            <p className="text-slate-500 text-sm">Comprehensive backend for manual review and confidence
                                score analysis.</p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* --- VISUAL PROCESS FLOW --- */}

            <section className="py-24 bg-slate-50 border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">The Verification
                            Lifecycle</h2>
                        <p className="text-slate-500 max-w-xl mx-auto">A seamless flow designed to maximize security
                            while minimizing user drop-off.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            {title: "Initialization", desc: "User starts onboarding with biometric consent."},
                            {title: "ID Capture", desc: "OCR engine scans and validates government documents."},
                            {title: "Liveness", desc: "Front camera match ensures user is physically present."},
                            {title: "Verdict", desc: "AI provides confidence scores and instant results."},
                        ].map((step, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center group">
                                <div
                                    className="w-16 h-16 rounded-full bg-white border-4 border-blue-100 flex items-center justify-center text-blue-600 font-black text-xl mb-6 shadow-sm group-hover:border-blue-600 group-hover:text-blue-600 transition-colors">
                                    {idx + 1}
                                </div>
                                <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                                <p className="text-slate-500 text-sm leading-relaxed px-4">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CTA SECTION --- */}
            <section className="py-28 max-w-7xl mx-auto px-6">
                <div
                    className="bg-linear-to-r from-blue-700 to-indigo-800 rounded-[3rem] p-10 md:p-24 text-white text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Ready to integrate?</h2>
                        <p className="text-blue-100 text-xl max-w-2xl mx-auto mb-12 opacity-90">
                            Join dozens of developers using HC-402 to build secure,
                            identity-first applications for the modern mobile web.
                        </p>
                        <Link href="/onboarding">
                            <Button size="lg"
                                    className="h-16 px-12 text-lg rounded-2xl bg-white text-blue-700 hover:bg-slate-100 font-bold">
                                Get Started Now
                            </Button>
                        </Link>
                    </div>
                    {/* Decorative shapes */}
                    <div
                        className="absolute top-0 left-0 w-64 h-64 bg-white/10 blur-[100px] -translate-x-1/2 -translate-y-1/2"/>
                    <div
                        className="absolute bottom-0 right-0 w-80 h-80 bg-blue-400/20 blur-[120px] translate-x-1/4 translate-y-1/4"/>
                </div>
            </section>

        </main>
    );
}