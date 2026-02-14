"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";
import {CheckCircle2, ChevronLeft, ChevronRight, ShieldCheck} from "lucide-react";
import {CameraComponent} from "@/components/Camera";
import FileUpload from "./FileUpload";

const STEPS = [
    {title: "Document Scan", subtitle: "Upload your Government ID"},
    {title: "Identity Match", subtitle: "Take a live biometric selfie"},
    {title: "Final Review", subtitle: "Confirm data and submit"},
];

export default function OnboardingWizard() {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const nextStep = () => setStep((s) => Math.min(s + 1, 3));
    const prevStep = () => setStep((s) => Math.max(s - 1, 1));

    async function handleFinalSubmit() {
        setIsSubmitting(true);
        // Simulate a high-end processing delay
        setTimeout(() => {
            router.push("/dashboard");
        }, 1500);
    }

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-lg space-y-6">

                {/* 1. HEADER SECTION */}
                <div className="text-center space-y-2 mb-4">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        {STEPS[step - 1].title}
                    </h1>
                    <p className="text-slate-500 text-sm">
                        {STEPS[step - 1].subtitle}
                    </p>
                </div>

                {/* 2. PROGRESS BAR */}
                <div className="px-2">
                    <div
                        className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                        <span>Progress</span>
                        <span>{Math.round((step / 3) * 100)}%</span>
                    </div>
                    <Progress value={(step / 3) * 100} className="h-1.5 bg-slate-100"/>
                </div>

                {/* 3. MAIN CONTENT CARD */}
                <Card className="border-none shadow-2xl bg-white/70 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
                    <CardContent className="p-6 md:p-10">
                        <div
                            className="min-h-87.5 flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {step === 1 && (
                                <FileUpload onUploadSuccess={nextStep}/>
                            )}

                            {step === 2 && (
                                <CameraComponent onCapture={(blob) => console.log(blob)}/>
                            )}

                            {step === 3 && (
                                <div className="text-center space-y-6">
                                    <div
                                        className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                                        <ShieldCheck className="w-10 h-10 text-blue-600"/>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-bold text-lg text-slate-900">Ready to Verify</h3>
                                        <p className="text-sm text-slate-500">
                                            Your ID and selfie have been processed locally.
                                            Press submit to finalize the secure verification.
                                        </p>
                                    </div>
                                    <div
                                        className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left space-y-2">
                                        <div className="flex justify-between text-xs font-medium">
                                            <span className="text-slate-400">ID Document</span>
                                            <span className="text-emerald-600 flex items-center gap-1"><CheckCircle2
                                                className="w-3 h-3"/> Captured</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-medium">
                                            <span className="text-slate-400">Biometric Scan</span>
                                            <span className="text-emerald-600 flex items-center gap-1"><CheckCircle2
                                                className="w-3 h-3"/> Captured</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>

                    {/* 4. NAVIGATION FOOTER */}
                    <div className="p-6 pt-0 flex gap-3">
                        {step > 1 && (
                            <Button
                                variant="outline"
                                onClick={prevStep}
                                className="h-14 w-14 rounded-2xl border-2 shrink-0"
                            >
                                <ChevronLeft className="w-5 h-5"/>
                            </Button>
                        )}

                        {step < 3 ? (
                            <Button
                                onClick={nextStep}
                                className="h-14 grow rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-md transition-all active:scale-[0.98]"
                            >
                                Continue <ChevronRight className="ml-2 w-5 h-5"/>
                            </Button>
                        ) : (
                            <Button
                                onClick={handleFinalSubmit}
                                disabled={isSubmitting}
                                className="h-14 grow rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-md shadow-lg shadow-blue-200"
                            >
                                {isSubmitting ? "Finalizing..." : "Submit Verification"}
                            </Button>
                        )}
                    </div>
                </Card>

                {/* 5. SECURITY FOOTNOTE */}
                <p className="text-center text-[11px] text-slate-400 font-medium">
                    Secured by HC-402 Protocol • End-to-End Encrypted Verification
                </p>
            </div>
        </div>
    );
}