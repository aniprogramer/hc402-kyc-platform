"use client";

import React, {useCallback, useEffect, useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {AlertTriangle, CameraIcon, CheckCircle2, Loader2, RefreshCcw} from "lucide-react";
import {cn} from "@/lib/utils";

interface CameraProps {
    kycId: string;
    onCaptureSuccess?: (filename: string) => void;
    className?: string;
}

export function CameraComponent({kycId, onCaptureSuccess, className}: CameraProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [captured, setCaptured] = useState<string | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const startCamera = useCallback(async () => {
        setError(null);
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "user",
                    width: {ideal: 1280},
                    height: {ideal: 720}
                },
                audio: false
            });

            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                // Important: Wait for video metadata to load before allowing capture
                videoRef.current.onloadedmetadata = () => {
                    setIsReady(true);
                };
            }
        } catch (err) {
            console.error("Camera access denied:", err);
            setError("Camera access denied. Please check permissions.");
        }
    }, []);

    useEffect(() => {
        startCamera();
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [startCamera]);

    const handleCapture = async () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas || video.readyState !== 4) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // 1. Capture the exact frame
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.save();
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.restore();

        // 2. Generate the static image URL
        const dataUrl = canvas.toDataURL("image/jpeg", 0.95);

        // 3. Update UI: This swaps <video> for <img>
        setCaptured(dataUrl);

        // 4. Stop the camera tracks so the "On" light turns off
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }

        // 5. Background Upload
        setLoading(true);
        try {
            const blobRes = await fetch(dataUrl);
            const blob = await blobRes.blob();
            const formData = new FormData();
            formData.append("file", blob, `selfie_${kycId}.jpg`);

            const res = await fetch(`/api/kyc/upload-selfie?kyc_id=${kycId}`, {
                method: "POST",
                body: formData,
            });

            const result = await res.json();
            if (result.success) onCaptureSuccess?.(result.data.filename);
        } catch (err) {
            console.error("Upload error", err);
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setCaptured(null);
        setError(null);
        setIsReady(false);
        startCamera();
    };

    return (
        <div className={cn("relative w-full max-w-md mx-auto", className)}>
            {/* Visual Viewport */}
            <div
                className="relative aspect-3/4 overflow-hidden rounded-[2.5rem] bg-slate-950 border-4 border-white shadow-2xl">
                {!captured ? (
                    <>
                        {/* video muted is essential for mobile autoplay */}
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="h-full w-full object-cover scale-x-[-1]"
                        />

                        {/* Biometric Guide Overlay */}
                        <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
                            <div
                                className="w-[85%] h-[75%] border-2 border-dashed border-white/40 rounded-[100%] shadow-[0_0_0_999px_rgba(15,23,42,0.5)]"/>
                        </div>

                        {/* Animated Scan Line */}
                        <div
                            className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-transparent via-blue-400 to-transparent animate-scan z-20"/>
                    </>
                ) : (
                    <img src={captured} alt="Captured Biometric" className="h-full w-full object-cover"/>
                )}

                {/* Info Badge */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-max">
                    <div
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] text-white uppercase tracking-widest font-bold">
                        <div
                            className={cn("w-2 h-2 rounded-full", captured ? "bg-green-500" : "bg-blue-500 animate-pulse")}/>
                        {loading ? "Analyzing..." : captured ? "Identity Locked" : "Position Face in Frame"}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="mt-8 flex flex-col items-center gap-4">
                {error && (
                    <div
                        className="flex items-center gap-2 text-rose-500 text-xs font-semibold bg-rose-50 px-4 py-2 rounded-lg">
                        <AlertTriangle className="w-4 h-4"/> {error}
                    </div>
                )}

                {!captured ? (
                    <Button
                        onClick={handleCapture}
                        disabled={!isReady || loading}
                        className="h-16 px-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-lg font-bold shadow-xl shadow-blue-200"
                    >
                        {loading ? <Loader2 className="animate-spin mr-2"/> : <CameraIcon className="mr-2"/>}
                        Capture Biometrics
                    </Button>
                ) : (
                    <div className="flex flex-col items-center gap-4 w-full">
                        <div className="flex items-center gap-2 text-emerald-600 font-bold">
                            <CheckCircle2 className="w-6 h-6"/> Data Uploaded Successfully
                        </div>
                        <Button
                            variant="outline"
                            onClick={reset}
                            disabled={loading}
                            className="h-12 px-8 rounded-xl border-2 font-bold"
                        >
                            <RefreshCcw className="mr-2 h-4 w-4"/> Retake Selfie
                        </Button>
                    </div>
                )}
            </div>

            {/* Hidden capture engine */}
            <canvas ref={canvasRef} className="hidden"/>

            <style jsx global>{`
                @keyframes scan {
                    0% {
                        top: 20%;
                        opacity: 0;
                    }
                    50% {
                        opacity: 1;
                    }
                    100% {
                        top: 80%;
                        opacity: 0;
                    }
                }

                .animate-scan {
                    animation: scan 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}