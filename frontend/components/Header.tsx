"use client";

import {useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {Menu, ShieldCheck} from "lucide-react";
import InstallButton from "./InstallButton";
import {cn} from "@/lib/utils";

export default function Header() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        {name: "Home", href: "/"},
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
                <InstallButton/>
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
                    <SheetContent side="right" className="w-70 pt-12">
                        <nav className="flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                        "text-xl font-semibold transition-colors",
                                        pathname === link.href ? "text-blue-600" : "text-slate-900"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}