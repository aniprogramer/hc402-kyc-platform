import type {NextConfig} from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    turbopack: {}, // empty config to satisfy Next.js 16
};

export default withPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
    runtimeCaching: [
        {
            urlPattern: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: {cacheName: "google-fonts", expiration: {maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365},},
        },
        {
            urlPattern: /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: {cacheName: "google-fonts-stylesheets",},
        },
        {
            urlPattern: /^https:\/\/your-backend-domain\.com\/api\/.*$/i,
            handler: "NetworkFirst",
            options: {
                cacheName: "api-cache",
                networkTimeoutSeconds: 10,
                expiration: {maxEntries: 50, maxAgeSeconds: 60 * 60},
            },
        },
        {
            urlPattern: /^\/_next\/image\?url=.+$/i,
            handler: "CacheFirst",
            options: {cacheName: "next-image-cache", expiration: {maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30},},
        },
        {
            urlPattern: /^\/.*$/i,
            handler: "NetworkFirst",
            options: {cacheName: "pages-cache", expiration: {maxEntries: 50, maxAgeSeconds: 60 * 60 * 24},},
        },
    ],
})
(nextConfig);