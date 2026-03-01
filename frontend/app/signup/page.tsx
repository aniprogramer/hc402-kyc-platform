"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {ArrowRight, CheckCircle2, Loader2, UserPlus} from "lucide-react";

export default function SignupPage() {
    const [formData, setFormData] = useState({username: "", email: "", password: ""});
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Pointing to your teammate's FastAPI /auth/register endpoint
            const res = await fetch(`http://localhost:8000/auth/register`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                // Smooth transition to log in
                router.push("/login?registered=true");
            } else {
                const error = await res.json();
                alert(error.detail || "Registration failed");
            }
        } catch (err) {
            console.error("Signup error:", err);
            alert("Connection to security server failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[#fafafa] p-4 overflow-hidden">

            {/* Background Glows */}
            <div className="absolute inset-0 -z-10">
                <div
                    className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-100/50 blur-[100px] rounded-full"/>
                <div
                    className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-indigo-100/40 blur-[100px] rounded-full"/>
            </div>

            <div className="w-full max-w-112.5 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Header */}
                <div className="flex flex-col items-center mb-6 space-y-3">
                    <div className="bg-blue-600 p-3 rounded-2xl shadow-xl shadow-blue-200">
                        <UserPlus className="w-8 h-8 text-white"/>
                    </div>
                    <div className="text-center">
                        <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
                            Create <span className="text-blue-600">ID</span>
                        </h1>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                            Initialize HC-402 Credentials
                        </p>
                    </div>
                </div>

                <div
                    className="bg-white/80 backdrop-blur-xl border border-white shadow-2xl rounded-[2.5rem] p-8 md:p-10">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Full
                                Name</label>
                            <Input
                                placeholder="John Doe"
                                required
                                className="h-12 rounded-xl bg-white/50 border-slate-200"
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Work
                                Email</label>
                            <Input
                                type="email"
                                placeholder="john@company.com"
                                required
                                className="h-12 rounded-xl bg-white/50 border-slate-200"
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Master
                                Password</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                required
                                className="h-12 rounded-xl bg-white/50 border-slate-200"
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </div>

                        {/* Security Checklist */}
                        <div className="py-2 space-y-2">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600">
                                <CheckCircle2 className="w-3 h-3"/> AES-256 BANK-GRADE ENCRYPTION
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600">
                                <CheckCircle2 className="w-3 h-3"/> NO DATA SHARED WITH THIRD PARTIES
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-200 active:scale-95 transition-all"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin"/> : (
                                <span className="flex items-center gap-2">Initialize Account <ArrowRight
                                    className="w-4 h-4"/></span>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                        <p className="text-xs text-slate-500 font-medium">
                            Already have an account?{" "}
                            <Link href="/login" className="text-blue-600 font-bold hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="mt-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">
                    HC-402 Protocol • ISO 27001 Compliant
                </p>
            </div>
        </div>
    );
}