"use client";
import {useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

export default function FileUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleUpload() {
        if (!file) return;
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("document", file);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");
            console.log("Upload successful");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center space-y-4">
            <Input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {file && <p className="text-sm text-gray-600">Selected: {file.name}</p>}
            <Button onClick={handleUpload} disabled={!file || loading}>
                {loading ? "Uploading..." : "Upload"}
            </Button>
            {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
    );
}