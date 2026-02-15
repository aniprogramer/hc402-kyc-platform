"use client";

import {useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {signOut, useSession} from "next-auth/react"; // Import Auth hooks
import {Button} from "@/components/ui/button";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {Loader2, LogOut, Menu, ShieldCheck, User as UserIcon} from "lucide-react";
import InstallButton from "./InstallButton";
import {cn} from "@/lib/utils";

export default function Header() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    // 1. Grab session data
    const {data: session, status} = useSession();
    const isLoading = status === "loading";

    const navLinks = [
        {name: "Home", href: "/"},
        {name: "Verification", href: "/onboarding"}, // Updated to point to wizard
        {name: "Dashboard", href: "/dashboard"},
    ];

    return (
        <header
            className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md px-6 py-3 flex items-center justify-between">
            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                    <ShieldCheck className="w-5 h-5 text-white"/>
                </div>
                <span className="text-lg font-bold tracking-tight text-slate-900">
                    HC‑402 <span className="text-blue-600">KYC</span>
                </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "text-sm font-medium transition-colors hover:text-blue-600",
                            pathname === link.href ? "text-blue-600" : "text-slate-500"
                        )}
                    >
                        {link.name}
                    </Link>
                ))}

                <div className="flex items-center gap-4 border-l pl-8">
                    <InstallButton/>

                    {/* 2. AUTHENTICATION UI */}
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-slate-400"/>
                    ) : session ? (
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col items-end">
                                <span className="text-xs font-bold text-slate-900">{session.user?.name}</span>
                                <span
                                    className="text-[10px] text-slate-500 truncate max-w-25">{session.user?.email}</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => signOut({callbackUrl: "/"})}
                                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl"
                            >
                                <LogOut className="w-4 h-4"/>
                            </Button>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6">
                                Sign In
                            </Button>
                        </Link>
                    )}
                </div>
            </nav>

            {/* Mobile Navigation */}
            <div className="flex md:hidden items-center gap-3">
                <InstallButton/>
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-slate-600">
                            <Menu className="w-6 h-6"/>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full sm:w-80 pt-12">
                        {/* User Profile in Mobile Menu */}
                        {session && (
                            <div className="mb-8 p-4 bg-slate-50 rounded-2xl flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                                    <UserIcon className="w-6 h-6"/>
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{session.user?.name}</p>
                                    <p className="text-xs text-slate-500">{session.user?.email}</p>
                                </div>
                            </div>
                        )}

                        <nav className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                        "text-xl font-semibold p-2 rounded-xl transition-colors",
                                        pathname === link.href ? "bg-blue-50 text-blue-600" : "text-slate-900"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <hr className="my-4 border-slate-100"/>

                            {session ? (
                                <Button
                                    variant="destructive"
                                    className="w-full rounded-xl h-12"
                                    onClick={() => signOut({callbackUrl: "/"})}
                                >
                                    <LogOut className="w-4 h-4 mr-2"/> Sign Out
                                </Button>
                            ) : (
                                <Link href="/login" onClick={() => setOpen(false)}>
                                    <Button className="w-full bg-blue-600 rounded-xl h-12">Sign In</Button>
                                </Link>
                            )}
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}