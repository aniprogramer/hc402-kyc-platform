"use client";

import {signIn} from "next-auth/react";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {ArrowRight, Loader2, Lock, ShieldCheck} from "lucide-react";
import {cn} from "@/lib/utils";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.ok) {
            router.push("/onboarding");
        } else {
            alert("Login failed. Try test@example.com");
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[#fafafa] p-4 overflow-hidden">

            {/* Background Decoration */}
            <div className="absolute inset-0 -z-10">
                <div
                    className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-100/40 blur-[120px] rounded-full"/>
                <div
                    className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-100/30 blur-[120px] rounded-full"/>
            </div>

            <div className="w-full max-w-100 animate-in fade-in zoom-in duration-500">

                {/* Logo / Brand Header */}
                <div className="flex flex-col items-center mb-8 space-y-3">
                    <div className="bg-blue-600 p-3 rounded-2xl shadow-xl shadow-blue-200">
                        <ShieldCheck className="w-8 h-8 text-white"/>
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">
                            HC-402 <span className="text-blue-600">Access</span>
                        </h1>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                            Secure Identity Protocol
                        </p>
                    </div>
                </div>

                {/* Login Card */}
                <div
                    className="bg-white/80 backdrop-blur-xl border border-white shadow-2xl rounded-[2.5rem] p-8 md:p-10">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                                Email Address
                            </label>
                            <Input
                                type="email"
                                placeholder="name@company.com"
                                required
                                className="h-12 rounded-xl border-slate-200 focus:ring-blue-500 bg-white/50"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    Password
                                </label>
                                <span
                                    className="text-[10px] font-bold text-blue-600 cursor-pointer hover:underline">Forgot?</span>
                            </div>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                required
                                className="h-12 rounded-xl border-slate-200 focus:ring-blue-500 bg-white/50"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className={cn(
                                "w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-lg",
                                "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
                            )}
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin"/>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Sign In to Portal <ArrowRight className="w-4 h-4"/>
                                </span>
                            )}
                        </Button>
                    </form>

                    {/* Mock Data Hint */}
                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <div
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                            <Lock className="w-3 h-3 text-slate-400"/>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                                Demo: <span className="text-slate-900 italic">test@example.com</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Footer */}
                <p className="mt-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">
                    End-to-End Encrypted Session
                </p>
            </div>
        </div>
    );
}