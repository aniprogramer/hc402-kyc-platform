"use client";
import {useEffect, useRef} from "react";
import {Button} from "@/components/ui/button";

export default function Camera() {
    const videoRef = useRef<HTMLVideoElement>(null);

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

    return (
        <div className="flex flex-col items-center">
            <video ref={videoRef} autoPlay playsInline className="w-full rounded"/>
            <Button className="mt-4">Capture</Button>
        </div>
    );
}
