"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";
import {ArrowRight, CheckCircle2, ChevronLeft, Loader2, ShieldCheck} from "lucide-react";
import {CameraComponent} from "@/components/Camera";
import FileUpload from "./FileUpload";
import {cn} from "@/lib/utils";

const STEPS = [
    {title: "Document Scan", subtitle: "Upload your Government ID"},
    {title: "Identity Match", subtitle: "Take a live biometric selfie"},
    {title: "Final Review", subtitle: "Confirm data and submit"},
];

interface WizardProps {
    kycId: string;
}

export default function OnboardingWizard({kycId}: WizardProps) {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    // Track completion to show the "Continue" button
    const [idUploaded, setIdUploaded] = useState(false);
    const [selfieCaptured, setSelfieCaptured] = useState(false);

    const nextStep = () => setStep((s) => Math.min(s + 1, 3));
    const prevStep = () => setStep((s) => Math.max(s - 1, 1));

    const handleIdSuccess = (filename: string) => {
        console.log("ID Uploaded:", filename);
        setIdUploaded(true);
        // We don't auto-advance anymore; we let the user click "Continue"
    };

    const handleSelfieSuccess = (filename: string) => {
        console.log("Selfie Uploaded:", filename);
        setSelfieCaptured(true);
    };

    async function handleFinalSubmit() {
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/kyc/verify", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({kycId}),
            });

            if (res.ok) {
                router.push("/dashboard/");
            } else {
                alert("Verification failed to initiate. Please try again.");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    }

    // Determine if we should show the "Continue" button
    const showContinue = (step === 1 && idUploaded) || (step === 2 && selfieCaptured);

    return (
        <div className="w-full max-w-lg space-y-6">
            {/* 1. HEADER */}
            <div className="text-center space-y-2 mb-4">
                <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 uppercase">
                    {STEPS[step - 1].title}
                </h1>
                <p className="text-slate-500 text-sm font-medium italic">
                    {STEPS[step - 1].subtitle}
                </p>
            </div>

            {/* 2. PROGRESS */}
            <div className="px-2">
                <div
                    className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                    <span>Step {step} of 3</span>
                    <span>{Math.round((step / 3) * 100)}%</span>
                </div>
                <Progress value={(step / 3) * 100} className="h-1.5 bg-slate-100"/>
            </div>

            {/* 3. MAIN CARD */}
            <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
                <CardContent className="p-6 md:p-10">
                    <div
                        className="min-h-[380px] flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {step === 1 && <FileUpload kycId={kycId} onUploadSuccess={handleIdSuccess}/>}
                        {step === 2 && <CameraComponent kycId={kycId} onCaptureSuccess={handleSelfieSuccess}/>}
                        {step === 3 && (
                            <div className="text-center space-y-6">
                                <div
                                    className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                                    <ShieldCheck className="w-10 h-10 text-emerald-600"/>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-black text-xl text-slate-900 uppercase tracking-tight">Audit
                                        Ready</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        Data packets are sealed and ready for biometric comparison.
                                    </p>
                                </div>
                                <div
                                    className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-left space-y-3">
                                    <div className="flex justify-between text-xs font-bold uppercase">
                                        <span className="text-slate-400 tracking-tighter">ID Scan</span>
                                        <span className="text-emerald-600 flex items-center gap-1">
                                            <CheckCircle2 className="w-4 h-4"/> Ready
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold uppercase">
                                        <span className="text-slate-400 tracking-tighter">Biometrics</span>
                                        <span className="text-emerald-600 flex items-center gap-1">
                                            <CheckCircle2 className="w-4 h-4"/> Ready
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>

                {/* 4. NAVIGATION FOOTER (The "Continue" Button is here) */}
                <div className="p-6 pt-0 flex gap-3">
                    {step > 1 && !isSubmitting && (
                        <Button
                            variant="outline"
                            onClick={prevStep}
                            className="h-14 w-14 rounded-2xl border-2 shrink-0 transition-all hover:bg-slate-50 active:scale-90"
                        >
                            <ChevronLeft className="w-5 h-5 text-slate-600"/>
                        </Button>
                    )}

                    {/* Step 1 & 2 Continue Button */}
                    {(step < 3) && (
                        <Button
                            onClick={nextStep}
                            disabled={!showContinue}
                            className={cn(
                                "h-14 grow rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-lg",
                                showContinue
                                    ? "bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700"
                                    : "bg-slate-100 text-slate-400 shadow-none border border-slate-200"
                            )}
                        >
                            {showContinue ? (
                                <span className="flex items-center gap-2">Continue <ArrowRight
                                    className="w-4 h-4"/></span>
                            ) : (
                                "Complete Step to Continue"
                            )}
                        </Button>
                    )}

                    {/* Step 3 Final Submit Button */}
                    {step === 3 && (
                        <Button
                            onClick={handleFinalSubmit}
                            disabled={isSubmitting}
                            className="h-14 grow rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-200 transition-all active:scale-95"
                        >
                            {isSubmitting ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Auditing...</>
                            ) : (
                                "Start Final Verification"
                            )}
                        </Button>
                    )}
                </div>
            </Card>

            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                Secure Session: {kycId}
            </p>
        </div>
    );
}