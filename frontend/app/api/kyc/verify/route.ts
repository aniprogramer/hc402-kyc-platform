import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";

export async function POST(req: Request) {
    try {
        // 1. Session check
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({success: false, message: "Unauthorized"}, {status: 401});
        }

        const body = await req.json();
        const kycId = body.kycId;

        // 2. Identity pinning: Ensure the user is verifying their own account
        if (kycId !== (session.user as any).id) {
            return NextResponse.json({success: false, message: "ID Mismatch"}, {status: 403});
        }

        // 3. Call FastAPI to start the AI/OCR logic
        // We pass kyc_id as a query param to match your Python route
        const response = await fetch(`${process.env.PYTHON_BACKEND_URL}/kyc/verify?kyc_id=${kycId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                {success: false, message: errorData.detail || "Analysis failed"},
                {status: response.status}
            );
        }

        const data = await response.json();

        // Return the AI results (confidence scores, OCR text, etc.)
        return NextResponse.json(data);

    } catch (error) {
        console.error("Verification Proxy Error:", error);
        return NextResponse.json({success: false, message: "Verification Bridge Failed"}, {status: 500});
    }
}