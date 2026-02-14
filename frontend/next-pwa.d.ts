// types/next-pwa.d.ts
declare module "next-pwa" {
    import type { NextConfig } from "next";

    interface PWAOptions {
        dest?: string;
        register?: boolean;
        skipWaiting?: boolean;
        disable?: boolean;
        // add other options if needed
        runtimeCaching?: Array<{
            urlPattern: RegExp;
            handler: "CacheFirst" | "NetworkFirst" | "StaleWhileRevalidate";
            options?: {
                cacheName?: string;
                expiration?: {
                    maxEntries?: number;
                    maxAgeSeconds?: number;
                };
                networkTimeoutSeconds?: number;
            };
        }>;
    }

    export default function withPWA(options?: PWAOptions): (config: NextConfig) => NextConfig;
}
