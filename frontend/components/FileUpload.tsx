"use client";

import React, {useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {CheckCircle2, FileWarning, Image as ImageIcon, Loader2, UploadCloud, X} from "lucide-react";
import {cn} from "@/lib/utils";

interface FileUploadProps {
    onUploadSuccess?: (data: any) => void;
    className?: string;
}

export default function FileUpload({onUploadSuccess, className}: FileUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (selectedFile: File | undefined) => {
        if (!selectedFile) return;

        // Validate File Type & Size (Max 5MB)
        if (!selectedFile.type.startsWith("image/")) {
            setError("Please upload an image file (JPG, PNG, PDF).");
            return;
        }
        if (selectedFile.size > 5 * 1024 * 1024) {
            setError("File is too large. Max limit is 5MB.");
            return;
        }

        setError(null);
        setFile(selectedFile);

        // Create Preview URL
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(selectedFile);
    };

    const clearFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFile(null);
        setPreview(null);
        setError(null);
    };

    async function handleUpload() {
        if (!file) return;
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("document", file);

            // Simulated Delay for Demo Effect
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Connection unstable. Queuing for background sync.");

            onUploadSuccess?.(await res.json());
        } catch (err: any) {
            setError(err.message);
            // Logic for PWA Background Sync would go here
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={cn("w-full max-w-md mx-auto space-y-4", className)}>
            <Card
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    handleFileChange(e.dataTransfer.files[0]);
                }}
                className={cn(
                    "relative border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden",
                    isDragging ? "border-blue-500 bg-blue-50/50" : "border-slate-200 hover:border-slate-300",
                    file ? "border-solid border-blue-100 bg-slate-50/30" : "p-10"
                )}
                onClick={() => !file && document.getElementById("file-input")?.click()}
            >
                <Input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files?.[0])}
                />

                {!file ? (
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div
                            className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <UploadCloud className="w-8 h-8"/>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">Upload ID Document</p>
                            <p className="text-xs text-slate-500 mt-1">Drag and drop or click to browse</p>
                        </div>
                        <div className="flex gap-2">
                            <span
                                className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded">PNG</span>
                            <span
                                className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded">JPG</span>
                            <span
                                className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded">PDF</span>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 flex items-center gap-4">
                        {/* Image Thumbnail Preview */}
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden border bg-white shrink-0">
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-full h-full object-cover"/>
                            ) : (
                                <div
                                    className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                                    <ImageIcon className="w-6 h-6"/>
                                </div>
                            )}
                        </div>

                        <div className="grow min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">{file.name}</p>
                            <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            <div className="flex items-center gap-1 text-blue-600 mt-1">
                                <CheckCircle2 className="w-3 h-3"/>
                                <span className="text-[10px] font-bold uppercase">Ready to scan</span>
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full hover:bg-red-50 hover:text-red-500 text-slate-400"
                            onClick={clearFile}
                        >
                            <X className="w-5 h-5"/>
                        </Button>
                    </div>
                )}
            </Card>

            {/* ERROR MESSAGE */}
            {error && (
                <div
                    className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-100">
                    <FileWarning className="w-4 h-4 shrink-0"/>
                    {error}
                </div>
            )}

            {/* ACTION BUTTON */}
            <Button
                onClick={handleUpload}
                disabled={!file || loading}
                className={cn(
                    "w-full h-14 rounded-2xl text-md font-bold transition-all",
                    file && !loading ? "bg-blue-600 shadow-lg shadow-blue-200" : "bg-slate-100 text-slate-400"
                )}
            >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin"/>
                        Extracting Data...
                    </>
                ) : (
                    "Proceed to Verification"
                )}
            </Button>
        </div>
    );
}