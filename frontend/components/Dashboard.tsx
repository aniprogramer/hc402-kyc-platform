"use client";
import {useEffect, useState} from "react";
import {Card, CardContent, CardHeader} from "@/components/ui/card";

export default function Dashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchResults() {
            try {
                const res = await fetch("/api/verify");
                const json = await res.json();
                setData(json);
            } catch (err) {
                console.error("Error fetching verification results:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchResults();
    }, []);

    if (loading) return <p>Loading results...</p>;

    return (
        <Card className="max-w-md mx-auto space-y-4">
            <CardHeader>
                <h2 className="text-xl font-bold">Verification Results</h2>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="p-4 bg-green-100 rounded">✅ Status: {data?.status}</div>
                <div className="p-4 bg-gray-100 rounded">Confidence: {data?.confidence}%</div>
                <div className="p-4 bg-gray-100 rounded">OCR: {data?.ocr}</div>
                <div className="p-4 bg-gray-100 rounded">Face Match: {data?.faceMatch ? "✅ Match" : "❌ No Match"}</div>
            </CardContent>
        </Card>
    );
}