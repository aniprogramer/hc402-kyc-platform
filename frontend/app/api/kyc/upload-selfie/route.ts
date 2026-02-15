import {NextResponse} from "next/server";

export async function POST(req: Request) {
    try {
        const {searchParams} = new URL(req.url);
        const kycId = searchParams.get("kyc_id");
        const formData = await req.formData();

        // Forward to Python: http://localhost:8000/kyc/upload-selfie?kyc_id=...
        const response = await fetch(`${process.env.PYTHON_BACKEND_URL}/kyc/upload-selfie?kyc_id=${kycId}`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        return NextResponse.json(data, {status: response.status});
    } catch (error) {
        return NextResponse.json({success: false, message: "Selfie Proxy Error"}, {status: 500});
    }
}