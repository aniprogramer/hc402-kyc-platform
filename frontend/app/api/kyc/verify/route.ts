import {NextResponse} from "next/server";

export async function POST(req: Request) {
    try {
        const {kycId} = await req.json();

        // Calling FastAPI: http://localhost:8000/kyc/verify?kyc_id=...
        const response = await fetch(`${process.env.PYTHON_BACKEND_URL}/kyc/verify?kyc_id=${kycId}`, {
            method: "POST",
        });

        const data = await response.json();
        return NextResponse.json(data, {status: response.status});
    } catch (error) {
        return NextResponse.json({success: false, message: "Verification Proxy Error"}, {status: 500});
    }
}