import type {MetadataRoute} from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "HC-402 KYC Platform",
        short_name: "HC-402",
        description: "Secure digital identity verification",
        start_url: "/onboarding", // Start users right at the wizard
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#2563eb", // Using the blue-600 color from your UI
        icons: [
            {
                src: "/vercel.svg",
                sizes: "192x192",
                type: "image/svg+xml",
            },
        ],
    };
}