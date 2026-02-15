// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "KYC Account",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // --- ACTUAL LOGIC (COMMENTED OUT) ---
                /*
                const res = await fetch(`${process.env.PYTHON_BACKEND_URL}/auth/login`, {
                    method: "POST",
                    body: JSON.stringify(credentials),
                    headers: { "Content-Type": "application/json" },
                });

                const user = await res.json();

                if (res.ok && user) {
                    return {
                        id: user.kyc_id,
                        email: user.email,
                        name: user.full_name,
                    };
                }
                */

                // --- MOCK LOGIC START ---
                // For testing, let's allow "test@example.com" with any password
                if (credentials?.email === "test@example.com") {
                    console.log("MOCK AUTH: Logged in as test user");
                    return {
                        id: "HC-MOCK-9921", // Simulating the kyc_id from Python
                        email: "test@example.com",
                        name: "Alex Demo",
                    };
                }

                // Return null if the email doesn't match our mock
                return null;
                // --- MOCK LOGIC END ---
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.id = (user as any).id;
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
};