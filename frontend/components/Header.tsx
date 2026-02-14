"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import InstallButton from "./InstallButton";

export default function Header() {
    const [open, setOpen] = useState(false);

    return (
        <header className="border-b bg-white px-4 py-2 flex items-center justify-between">
            <h1 className="text-xl font-bold text-blue-600">HC-402 KYC</h1>

            {/* Desktop Nav */}
            <div className="hidden md:flex">
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink href="/">Home</NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink href="/dashboard">Dashboard</NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>

            {/* Mobile Nav */}
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" className="md:hidden">☰</Button>
                </SheetTrigger>
                <SheetContent side="right">
                    <nav className="flex flex-col space-y-4 mt-6">
                        <a href="/" onClick={() => setOpen(false)}>Home</a>
                        <a href="/dashboard" onClick={() => setOpen(false)}>Dashboard</a>
                    </nav>
                </SheetContent>
            </Sheet>

            {/* Install Button (desktop only) */}
            <div className="hidden md:block">
                <InstallButton />
            </div>
        </header>
    );
}