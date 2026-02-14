"use client";
import {useState} from "react";
import {Input} from "@/components/ui/input";

export default function FileUpload() {
    const [file, setFile] = useState<File | null>(null);

    return (
        <div className="flex flex-col items-center">
            <Input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {file && <p className="mt-2 text-sm text-gray-600">Selected: {file.name}</p>}
        </div>
    );
}
