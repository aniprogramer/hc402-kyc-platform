import {Card, CardContent, CardHeader} from "@/components/ui/card";

export default function Dashboard() {
    return (
        <Card className="max-w-md mx-auto space-y-4">
            <CardHeader>
                <h2 className="text-xl font-bold">Verification Results</h2>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="p-4 bg-green-100 rounded">✅ Status: Verified</div>
                <div className="p-4 bg-gray-100 rounded">Confidence: 92%</div>
                <div className="p-4 bg-gray-100 rounded">OCR: Name, DOB, ID#</div>
                <div className="p-4 bg-gray-100 rounded">Face Match: ✅ Match</div>
            </CardContent>
        </Card>
    );
}
