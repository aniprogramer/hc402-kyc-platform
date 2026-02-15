// app/api/kyc/upload-id/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const kycId = searchParams.get("kyc_id");

        // This takes the multipart/form-data from the frontend
        const formData = await req.formData();

        // Forwarding to FastAPI (Ensure your .env has PYTHON_BACKEND_URL)
        const response = await fetch(
            `${process.env.PYTHON_BACKEND_URL}/kyc/upload-id?kyc_id=${kycId}`,
            {
                method: "POST",
                body: formData,
            }
        );

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("BFF Error:", error);
        return NextResponse.json({ success: false, message: "Upload Bridge Failed" }, { status: 500 });
    }
}