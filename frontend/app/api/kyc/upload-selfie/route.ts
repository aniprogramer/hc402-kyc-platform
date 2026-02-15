import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth"; // Importing that config we exported

export async function POST(req: Request) {
    try {
        // 1. Check if the user is logged in
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({success: false, message: "Unauthorized"}, {status: 401});
        }

        const {searchParams} = new URL(req.url);
        const kycId = searchParams.get("kyc_id");

        // 2. Security: Ensure they are uploading to their own KYC record
        if (kycId !== (session.user as any).id) {
            return NextResponse.json({success: false, message: "Identity mismatch"}, {status: 403});
        }

        const formData = await req.formData();

        // 3. Forward to Python
        const response = await fetch(
            `${process.env.PYTHON_BACKEND_URL}/kyc/upload-selfie?kyc_id=${kycId}`,
            {
                method: "POST",
                body: formData,
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Python Backend Error:", errorText);
            return NextResponse.json({success: false, message: "Backend storage failed"}, {status: response.status});
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Selfie Proxy Error:", error);
        return NextResponse.json({success: false, message: "Selfie Proxy Error"}, {status: 500});
    }
}