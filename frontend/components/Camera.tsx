"use client";

import React, {useCallback, useEffect, useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {CameraIcon, RefreshCcw} from "lucide-react";
import {cn} from "@/lib/utils";

interface CameraProps {
    onCapture: (blob: Blob) => void;
    className?: string;
}

export function CameraComponent({onCapture, className}: CameraProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [captured, setCaptured] = useState<string | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const startCamera = useCallback(async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {facingMode: "user", width: {ideal: 1280}, height: {ideal: 720}},
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                setIsReady(true);
            }
        } catch (err) {
            console.error("Camera error:", err);
        }
    }, []);

    useEffect(() => {
        startCamera();
        return () => stream?.getTracks().forEach((t) => t.stop());
    }, [startCamera]);

    const handleCapture = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext("2d");

        if (ctx) {
            // Natural mirror flip for the final save
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(videoRef.current, 0, 0);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
            setCaptured(dataUrl);

            // Kill stream to save resources
            stream?.getTracks().forEach((track) => track.stop());

            // Pass Blob to parent for API/State management
            const response = await fetch(dataUrl);
            const blob = await response.blob();
            onCapture(blob);
        }
    };

    const reset = () => {
        setCaptured(null);
        startCamera();
    };

    return (
        <div className={cn("relative w-full max-w-100 mx-auto", className)}>
            {/* Container with Biometric Stylings */}
            <div
                className="relative aspect-3/4 overflow-hidden rounded-[2rem] bg-slate-950 border-4 border-white shadow-2xl">

                {!captured ? (
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="h-full w-full object-cover scale-x-[-1]"
                        />
                        {/* Biometric Guide Overlay */}
                        <div className="absolute inset-0 z-10 pointer-events-none border-60 border-slate-900/40">
                            <div
                                className="w-full h-full border-2 border-dashed border-white/50 rounded-[100%] shadow-[0_0_0_999px_rgba(15,23,42,0.4)]"/>
                        </div>
                        {/* Animated Scan Bar */}
                        <div
                            className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-blue-400 to-transparent animate-scan z-20"/>
                    </>
                ) : (
                    <img src={captured} alt="Captured" className="h-full w-full object-cover"/>
                )}

                {/* Status Indicator */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
                    <div
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] text-white uppercase tracking-widest font-bold">
                        <div
                            className={cn("w-1.5 h-1.5 rounded-full", captured ? "bg-green-500" : "bg-blue-500 animate-pulse")}/>
                        {captured ? "Identity Locked" : "Live Biometric Feed"}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-center gap-4">
                {!captured ? (
                    <Button
                        onClick={handleCapture}
                        disabled={!isReady}
                        className="h-14 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
                    >
                        <CameraIcon className="mr-2 h-5 w-5"/> Capture ID
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        onClick={reset}
                        className="h-14 px-8 rounded-2xl border-2 hover:bg-slate-50"
                    >
                        <RefreshCcw className="mr-2 h-4 w-4"/> Retake
                    </Button>
                )}
            </div>

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
                    animation: scan 2.5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}