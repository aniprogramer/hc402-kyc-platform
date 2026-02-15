"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";
import {CheckCircle2, ChevronLeft, Loader2, ShieldCheck} from "lucide-react";
import {CameraComponent} from "@/components/Camera";
import FileUpload from "./FileUpload";

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

    // Track completion of sub-tasks
    const [idUploaded, setIdUploaded] = useState(false);
    const [selfieCaptured, setSelfieCaptured] = useState(false);

    const nextStep = () => setStep((s) => Math.min(s + 1, 3));
    const prevStep = () => setStep((s) => Math.max(s - 1, 1));

    const handleIdSuccess = (filename: string) => {
        console.log("ID Uploaded:", filename);
        setIdUploaded(true);
        nextStep();
    };

    const handleSelfieSuccess = (filename: string) => {
        console.log("Selfie Uploaded:", filename);
        setSelfieCaptured(true);
        nextStep();
    };

    async function handleFinalSubmit() {
        setIsSubmitting(true);
        try {
            // This is where you'd call your /api/kyc/verify proxy
            const res = await fetch("/api/kyc/verify", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({kycId}),
            });

            if (res.ok) {
                // Redirect to results/dashboard page
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

    return (
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
                    <span>Step {step} of 3</span>
                    <span>{Math.round((step / 3) * 100)}%</span>
                </div>
                <Progress value={(step / 3) * 100} className="h-1.5 bg-slate-100"/>
            </div>

            {/* 3. MAIN CONTENT CARD */}
            <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
                <CardContent className="p-6 md:p-10">
                    <div
                        className="min-h-[350px] flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {step === 1 && (
                            <FileUpload
                                kycId={kycId}
                                onUploadSuccess={handleIdSuccess}
                            />
                        )}

                        {step === 2 && (
                            <CameraComponent
                                kycId={kycId}
                                onCaptureSuccess={handleSelfieSuccess}
                            />
                        )}

                        {step === 3 && (
                            <div className="text-center space-y-6">
                                <div
                                    className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                                    <ShieldCheck className="w-10 h-10 text-blue-600"/>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-bold text-lg text-slate-900">Analysis Ready</h3>
                                    <p className="text-sm text-slate-500">
                                        Documents and biometrics have been securely uploaded.
                                        Click below to start the AI verification engine.
                                    </p>
                                </div>
                                <div
                                    className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-left space-y-3">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-400 uppercase tracking-tighter">ID Document</span>
                                        <span className="text-emerald-600 flex items-center gap-1">
                                            <CheckCircle2 className="w-4 h-4"/> VERIFIED UPLOAD
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold">
                                        <span
                                            className="text-slate-400 uppercase tracking-tighter">Biometric Scan</span>
                                        <span className="text-emerald-600 flex items-center gap-1">
                                            <CheckCircle2 className="w-4 h-4"/> VERIFIED CAPTURE
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>

                {/* 4. NAVIGATION FOOTER */}
                <div className="p-6 pt-0 flex gap-3">
                    {step > 1 && !isSubmitting && (
                        <Button
                            variant="outline"
                            onClick={prevStep}
                            className="h-14 w-14 rounded-2xl border-2 shrink-0 transition-all hover:bg-slate-50"
                        >
                            <ChevronLeft className="w-5 h-5"/>
                        </Button>
                    )}

                    {step === 3 ? (
                        <Button
                            onClick={handleFinalSubmit}
                            disabled={isSubmitting}
                            className="h-14 grow rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-md shadow-lg shadow-blue-200 transition-all active:scale-95"
                        >
                            {isSubmitting ? (
                                <><Loader2 className="mr-2 h-5 w-5 animate-spin"/> Running AI Audit...</>
                            ) : (
                                "Start Final Verification"
                            )}
                        </Button>
                    ) : (
                        <div className="grow"/> // Placeholder to keep layout consistent
                    )}
                </div>
            </Card>

            {/* 5. SECURITY FOOTNOTE */}
            <p className="text-center text-[11px] text-slate-400 font-medium uppercase tracking-widest">
                Protected by AES-256 Encryption & Biometric Liveness Detection
            </p>
        </div>
    );
}