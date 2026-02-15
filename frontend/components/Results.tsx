"use client";

import {useEffect, useState} from "react";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {
    Activity,
    AlertCircle,
    CheckCircle2,
    Clock,
    FileText,
    Fingerprint,
    Loader2,
    ShieldCheck,
    XCircle
} from "lucide-react";
import {cn} from "@/lib/utils";

interface ResultsProps {
    kycId: string; // Passed from the Onboarding Wizard
}

export default function Results({kycId}: ResultsProps) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const performVerification = async () => {
            try {
                // 1. Trigger the FastAPI Verify Route
                const verifyRes = await fetch(`/api/kyc/verify`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({kycId})
                });

                const verifyJson = await verifyRes.json();

                if (!verifyJson.success) {
                    throw new Error(verifyJson.message || "Verification process failed");
                }

                // 2. Map the FastAPI response to our UI state
                // FastAPI returns: { kyc_id, ocr_confidence, face_match_score, status }
                const result = verifyJson.data;

                setData({
                    status: result.status, // "VERIFIED" or "REJECTED"
                    confidence: result.ocr_confidence,
                    faceMatchScore: result.face_match_score,
                    ocr: `Session: ${result.kyc_id}`,
                    timestamp: new Date().toLocaleString(),
                });

            } catch (err: any) {
                console.error("KYC Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (kycId) performVerification();
    }, [kycId]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-12 space-y-6">
            <div className="relative">
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin"/>
                <Fingerprint className="w-8 h-8 text-blue-400 absolute inset-0 m-auto animate-pulse"/>
            </div>
            <div className="text-center space-y-2">
                <p className="text-lg font-bold text-slate-900">Finalizing Audit</p>
                <p className="text-sm text-slate-500 max-w-xs">Comparing biometric data against identity
                    documents...</p>
            </div>
        </div>
    );

    if (error) return (
        <Card className="border-rose-200 bg-rose-50 p-8 text-center">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4"/>
            <h3 className="text-lg font-bold text-rose-900">System Error</h3>
            <p className="text-sm text-rose-700">{error}</p>
        </Card>
    );

    const isSuccess = data?.status === "VERIFIED";

    return (
        <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* MAIN STATUS PLATE */}
            <div className={cn(
                "relative overflow-hidden rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl transition-colors duration-500",
                isSuccess ? "bg-slate-950" : "bg-rose-950"
            )}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[100px] -mr-32 -mt-32"/>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4 text-center md:text-left">
                        <Badge className={cn(
                            "px-4 py-1 border",
                            isSuccess ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-rose-500/20 text-rose-300 border-rose-500/30"
                        )}>
                            {isSuccess ? "Identity Validated" : "Verification Failed"}
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
                            {isSuccess ? "Ready to Onboard." : "Review Required."}
                        </h2>
                        <div
                            className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-400 text-sm">
                            <span className="flex items-center gap-1.5"><Clock
                                className="w-4 h-4"/> {data.timestamp}</span>
                            <span className="flex items-center gap-1.5"><Activity
                                className="w-4 h-4"/> Match: {data.faceMatchScore}%</span>
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
                <Card className="md:col-span-2 rounded-[2rem] border-slate-200/60 shadow-sm overflow-hidden bg-white">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <span
                            className="text-xs font-bold uppercase tracking-widest text-slate-500">Security Audit</span>
                        <FileText className="w-4 h-4 text-slate-400"/>
                    </div>
                    <CardContent className="p-6 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Verification Reference</p>
                                <p className="text-sm font-mono font-semibold truncate text-slate-700">{kycId}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">AI OCR Confidence</p>
                                <p className="text-sm font-semibold text-slate-700">{data.confidence}%</p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                            <span
                                className="text-[10px] text-slate-400 font-bold uppercase">Data Protection: AES-256</span>
                            <Badge variant="outline"
                                   className="text-[9px] font-bold text-emerald-600 border-emerald-200 bg-emerald-50">Local
                                DB Synced</Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className={cn(
                    "rounded-[2rem] text-white border-none p-6 flex flex-col justify-between shadow-xl transition-all duration-700",
                    isSuccess ? "bg-blue-600 shadow-blue-200" : "bg-slate-800 shadow-slate-200"
                )}>
                    <ShieldCheck className="w-8 h-8 opacity-50"/>
                    <div>
                        <p className="text-4xl font-black mb-1">{data.faceMatchScore}%</p>
                        <p className="text-[10px] font-medium text-blue-100 uppercase tracking-widest leading-tight">Face
                            Recognition Score</p>
                    </div>
                </Card>
            </div>
        </div>
    );
}