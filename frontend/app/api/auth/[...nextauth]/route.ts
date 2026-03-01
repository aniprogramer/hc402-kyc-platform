import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

// In the App Router, you MUST export the handler as specific HTTP methods
export { handler as GET, handler as POST };