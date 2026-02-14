"use client";

import {useEffect, useState} from "react";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Activity, CheckCircle2, Clock, FileText, Fingerprint, Loader2, ShieldCheck, XCircle} from "lucide-react";
import {cn} from "@/lib/utils";

export default function Results() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            // Simulated API delay for that "AI Processing" feel
            await new Promise(resolve => setTimeout(resolve, 1500));
            setData({
                status: "Verified",
                confidence: 98.4,
                ocr: "JOHN DOE | ID: 998234-A",
                faceMatch: true,
                timestamp: new Date().toLocaleString(),
                location: "New York, US (IP: 192.168.1.1)"
            });
            setLoading(false);
        };
        fetchResults();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-12 space-y-6">
            <div className="relative">
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin"/>
                <Fingerprint className="w-8 h-8 text-blue-400 absolute inset-0 m-auto animate-pulse"/>
            </div>
            <div className="text-center space-y-2">
                <p className="text-lg font-bold text-slate-900">Finalizing Audit</p>
                <p className="text-sm text-slate-500 max-w-50">Running cross-checks against global
                    watchlist...</p>
            </div>
        </div>
    );

    const isSuccess = data?.faceMatch && data?.confidence > 70;

    return (
        <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* MAIN STATUS PLATE */}
            <div className={cn(
                "relative overflow-hidden rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl",
                isSuccess ? "bg-slate-950" : "bg-rose-950"
            )}>
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[100px] -mr-32 -mt-32"/>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4 text-center md:text-left">
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-1">
                            {isSuccess ? "Identity Validated" : "Action Required"}
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
                            {isSuccess ? "Verification Ready." : "Review Needed."}
                        </h2>
                        <div
                            className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-400 text-sm">
                            <span className="flex items-center gap-1.5"><Clock
                                className="w-4 h-4"/> {data.timestamp}</span>
                            <span className="flex items-center gap-1.5"><Activity
                                className="w-4 h-4"/> Confidence: {data.confidence}%</span>
                        </div>
                    </div>
                    <div className="shrink-0">
                        {isSuccess ? (
                            <div
                                className="w-24 h-24 rounded-full border-4 border-emerald-500/50 flex items-center justify-center bg-emerald-500/10 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                                <CheckCircle2 className="w-12 h-12 text-emerald-500"/>
                            </div>
                        ) : (
                            <div
                                className="w-24 h-24 rounded-full border-4 border-rose-500/50 flex items-center justify-center bg-rose-500/10">
                                <XCircle className="w-12 h-12 text-rose-500"/>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* AUDIT GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* OCR Detail */}
                <Card className="md:col-span-2 rounded-[2rem] border-slate-200/60 shadow-sm overflow-hidden">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <span
                            className="text-xs font-bold uppercase tracking-widest text-slate-500">Extracted Metadata</span>
                        <FileText className="w-4 h-4 text-slate-400"/>
                    </div>
                    <CardContent className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Document Name</p>
                                <p className="text-sm font-semibold">{data.ocr.split('|')[0]}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Document ID</p>
                                <p className="text-sm font-semibold font-mono">{data.ocr.split('|')[1]}</p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                            <span className="text-xs text-slate-500 italic">Origin: {data.location}</span>
                            <Badge variant="outline" className="text-[10px] font-bold">Valid Checksum</Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Score Summary */}
                <Card
                    className="rounded-[2rem] bg-blue-600 text-white border-none p-6 flex flex-col justify-between shadow-xl shadow-blue-200">
                    <ShieldCheck className="w-8 h-8 opacity-50"/>
                    <div>
                        <p className="text-4xl font-black mb-1">{data.confidence}%</p>
                        <p className="text-xs font-medium text-blue-100 uppercase tracking-widest leading-tight">Biometric
                            Synergy Score</p>
                    </div>
                </Card>
            </div>
        </div>
    );
}