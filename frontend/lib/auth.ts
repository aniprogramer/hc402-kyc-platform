// lib/auth.ts
import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "KYC Account",
            credentials: {
                email: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials) {
                // --- ACTUAL LOGIC (UNCOMMENTED) ---
                try {
                    const res = await fetch(`${process.env.PYTHON_BACKEND_URL}/auth/login`, {
                        method: "POST",
                        body: JSON.stringify(credentials),
                        headers: {"Content-Type": "application/json"},
                    });

                    const user = await res.json();

                    if (res.ok && user) {
                        return {
                            id: user.kyc_id,
                            email: user.email,
                            name: user.full_name,
                        };
                    }
                } catch (error) {
                    // Log the error for debugging, but return null to signify auth failure
                    console.error("Authentication backend unreachable:", error);
                }

                // --- MOCK LOGIC (COMMENTED OUT) ---
                /*
                if (credentials?.email === "test@example.com") {
                    return {
                        id: "HC-MOCK-9921",
                        email: "test@example.com",
                        name: "Alex Demo",
                    };
                }
                */

                // This explicit null return fixes the TS2322 error
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({token, user}) {
            if (user) token.id = (user as any).id;
            return token;
        },
        async session({session, token}) {
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