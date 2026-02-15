"use client";

import { SessionProvider } from "next-auth/react";
import { PwaProvider } from "@/context/PwaContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            {/*<ThemeProvider*/}
            {/*    attribute="class"*/}
            {/*    defaultTheme="light"*/}
            {/*    enableSystem*/}
            {/*    disableTransitionOnChange*/}
            {/*>*/}
                <PwaProvider>
                    {/* The UI/UX content of the app */}
                    {children}

                    {/* Global UI Overlays */}
                    {/*<Toaster position="top-center" richColors closeButton />*/}
                </PwaProvider>
            {/*</ThemeProvider>*/}
        </SessionProvider>
    );
}