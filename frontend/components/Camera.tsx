"use client";
import {useEffect, useRef, useState} from "react";
import {Button} from "@/components/ui/button";

export default function Camera() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [captured, setCaptured] = useState<string | null>(null);

    useEffect(() => {
        async function setupCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({video: true});
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Camera access denied:", err);
            }
        }

        setupCamera();
    }, []);

    async function handleCapture() {
        if (!videoRef.current) return;
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL("image/png");
        setCaptured(dataUrl);

        // Send to backend
        const blob = await (await fetch(dataUrl)).blob();
        const formData = new FormData();
        formData.append("selfie", blob);

        await fetch("/api/capture", {
            method: "POST",
            body: formData,
        });
    }

    return (
        <div className="flex flex-col items-center">
            <video ref={videoRef} autoPlay playsInline className="w-full rounded"/>
            <Button className="mt-4" onClick={handleCapture}>Capture</Button>
            {captured && <img src={captured} alt="Captured" className="mt-4 rounded"/>}
        </div>
    );
}