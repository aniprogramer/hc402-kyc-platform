import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "HC-402 KYC Platform",
        short_name: "KYCApp",
        description: "Secure digital KYC and onboarding platform",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: [
            {
                src: "/vercel.svg",
                sizes: "192x192",
                type: "image/svg+xml",
            },
            // {
            //     src: "/icon-512x512.png",
            //     sizes: "512x512",
            //     type: "image/png",
            // },
        ],
    };
}
