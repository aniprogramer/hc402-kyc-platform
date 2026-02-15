import {getServerSession} from "next-auth";
import {NextResponse} from "next/server";
import {authOptions} from "@/lib/auth"; // Ensure you export your config

export async function POST(req: Request) {
    try {
        // 1. Session Validation
        // Only allow authenticated users to hit this proxy
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({success: false, message: "Unauthorized"}, {status: 401});
        }

        const {searchParams} = new URL(req.url);
        const kycId = searchParams.get("kyc_id");

        // 2. Security Cross-Check
        // Ensure the kyc_id in the URL matches the actual logged-in user's ID
        if (kycId !== (session.user as any).id) {
            return NextResponse.json({success: false, message: "Session mismatch"}, {status: 403});
        }

        // 3. Extract Form Data
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({success: false, message: "No file provided"}, {status: 400});
        }

        // 4. Forward to FastAPI
        const backendUrl = `${process.env.PYTHON_BACKEND_URL}/kyc/upload-id?kyc_id=${kycId}`;

        const response = await fetch(backendUrl, {
            method: "POST",
            body: formData, // Forwards multipart/form-data directly
            // Note: Don't set Content-Type header manually here;
            // the browser/fetch will auto-generate it with the boundary string.
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                {success: false, message: errorData.detail || "Backend upload failed"},
                {status: response.status}
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("KYC Upload Proxy Error:", error);
        return NextResponse.json(
            {success: false, message: "Internal Server Error in Upload Bridge"},
            {status: 500}
        );
    }
}