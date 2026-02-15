"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChevronRight, Loader2, LogOut, Menu, ShieldCheck, User as UserIcon } from "lucide-react";
import InstallButton from "./InstallButton";
import { cn } from "@/lib/utils";

export default function Header() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const isLoading = status === "loading";

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Verify", href: "/onboarding" },
        { name: "Dashboard", href: "/dashboard" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-md px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between">

            {/* LOGO */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
                <div className="bg-blue-600 p-1.5 rounded-lg group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <span className="text-base sm:text-lg font-black tracking-tighter text-slate-900 uppercase">
                    HC‑402 <span className="text-blue-600 hidden xs:inline tracking-normal lowercase font-bold">kyc</span>
                </span>
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden lg:flex items-center gap-8">
                <div className="flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-[11px] font-black uppercase tracking-[0.15em] transition-all hover:text-blue-600",
                                pathname === link.href ? "text-blue-600" : "text-slate-400"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4 border-l pl-8">
                    <InstallButton />

                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-slate-300" />
                    ) : session ? (
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-end leading-none">
                                <span className="text-[11px] font-black text-slate-900 uppercase">{session.user?.name}</span>
                                <span className="text-[9px] text-slate-400 font-medium truncate max-w-30">{session.user?.email}</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="h-9 w-9 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-full"
                            >
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login">
                                <Button variant="ghost" className="text-xs font-bold uppercase tracking-wider text-slate-600 px-4 h-9 rounded-full">Sign In</Button>
                            </Link>
                            <Link href="/signup">
                                <Button className="bg-blue-600 hover:bg-blue-700 rounded-full px-6 h-9 text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-100">Create ID</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </nav>

            {/* MOBILE & TABLET UI */}
            <div className="flex lg:hidden items-center gap-3">
                {/* Mobile Header Install Button - Now shows as just the Icon via the new InstallButton logic */}
                <InstallButton />

                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-slate-50 border border-slate-100">
                            <Menu className="w-5 h-5 text-slate-900" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full xs:w-[350px] p-0 border-l-0 flex flex-col bg-white">
                        <div className="p-6 pt-12 flex-1 overflow-y-auto">
                            <div className="flex items-center gap-2 mb-10">
                                <ShieldCheck className="w-6 h-6 text-blue-600" />
                                <span className="font-black text-xl tracking-tighter uppercase text-slate-900">Portal Menu</span>
                            </div>

                            <nav className="space-y-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        className={cn(
                                            "flex items-center justify-between p-4 rounded-2xl transition-all border",
                                            pathname === link.href
                                                ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100"
                                                : "bg-slate-50 border-slate-50 text-slate-900 hover:border-slate-200"
                                        )}
                                    >
                                        <span className="font-bold text-sm uppercase tracking-wide">{link.name}</span>
                                        <ChevronRight className={cn("w-4 h-4", pathname === link.href ? "text-white" : "text-slate-300")} />
                                    </Link>
                                ))}

                                {/* System Install link in menu for clarity */}
                                <div className="pt-4">
                                    <div className="px-4 py-2 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System</span>
                                        <InstallButton />
                                    </div>
                                </div>
                            </nav>
                        </div>

                        {/* AUTH FOOTER */}
                        <div className="p-6 bg-slate-50 border-t mt-auto">
                            {session ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 px-2">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border">
                                            <UserIcon className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-black text-xs uppercase text-slate-900 truncate">{session.user?.name}</p>
                                            <p className="text-[10px] text-slate-400 truncate">{session.user?.email}</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        className="w-full rounded-2xl h-12 font-bold uppercase tracking-widest text-[10px]"
                                        onClick={() => signOut({ callbackUrl: "/" })}
                                    >
                                        <LogOut className="w-4 h-4 mr-2" /> End Session
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    <Link href="/login" onClick={() => setOpen(false)} className="w-full">
                                        <Button variant="outline" className="w-full rounded-2xl h-12 font-bold uppercase tracking-widest text-[10px] border-2 border-slate-200">Sign In</Button>
                                    </Link>
                                    <Link href="/signup" onClick={() => setOpen(false)} className="w-full">
                                        <Button className="w-full bg-blue-600 rounded-2xl h-12 font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-blue-100">Join</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}