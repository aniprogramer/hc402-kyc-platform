import { registerRoute } from "workbox-routing";
import { NetworkFirst, NetworkOnly, CacheFirst, StaleWhileRevalidate } from "workbox-strategies";
import { BackgroundSyncPlugin } from "workbox-background-sync";

// --- Background Sync for uploads ---
const uploadQueue = new BackgroundSyncPlugin("kyc-upload-queue", {
    maxRetentionTime: 24 * 60, // retry for 24 hours
});

registerRoute(
    /\/api\/upload/,
    new NetworkOnly({ plugins: [uploadQueue] }),
    "POST"
);

// --- Cache verification results ---
registerRoute(
    /\/api\/verify/,
    new NetworkFirst({
        cacheName: "verify-cache",
        networkTimeoutSeconds: 5,
    }),
    "GET"
);

// --- Cache static assets (JS, CSS, fonts) ---
registerRoute(
    /^\/_next\/static\/.*/i,
    new CacheFirst({
        cacheName: "static-assets",
        plugins: [],
    }),
    "GET"
);

// --- Cache images ---
registerRoute(
    /^\/_next\/image\?url=.+$/i,
    new CacheFirst({
        cacheName: "next-image-cache",
        plugins: [],
    }),
    "GET"
);

// --- Cache Google Fonts ---
registerRoute(
    /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
    new CacheFirst({
        cacheName: "google-fonts",
        plugins: [],
    }),
    "GET"
);

registerRoute(
    /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
    new StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [],
    }),
    "GET"
);

// --- Cache pages (offline navigation) ---
registerRoute(
    /^\/.*$/i,
    new NetworkFirst({
        cacheName: "pages-cache",
        networkTimeoutSeconds: 10,
    }),
    "GET"
);
