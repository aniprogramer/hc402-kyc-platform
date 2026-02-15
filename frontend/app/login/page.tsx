"use client";
import {signIn} from "next-auth/react";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false, // Don't reload the page
        });

        if (result?.ok) {
            router.push("/onboarding"); // Redirect to your KYC wizard
        } else {
            alert("Login failed. Check your credentials.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <form onSubmit={handleSubmit} className="p-8 border rounded-xl space-y-4 w-80 shadow-lg">
                <h1 className="text-xl font-bold">KYC Portal Login</h1>
                <Input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
                <Input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                <Button type="submit" className="w-full">Sign In</Button>
            </form>
        </div>
    );
}