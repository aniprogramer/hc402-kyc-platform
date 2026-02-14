"use client";

import Results from "@/components/Results";
import {Button} from "@/components/ui/button";
import {Bell, Download, LayoutDashboard, LogOut, Search, Settings, Share2, User} from "lucide-react";
import {cn} from "@/lib/utils";

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-[#fafafa] flex">

            {/* SIDEBAR - Desktop Only */}
            <aside className="hidden lg:flex w-64 border-r bg-white flex-col p-6 space-y-8">
                <div className="flex items-center gap-2 px-2">
                    <div
                        className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold italic">H
                    </div>
                    <span className="font-bold tracking-tight">HC-402 Admin</span>
                </div>

                <nav className="flex-1 space-y-1">
                    <SidebarItem icon={<LayoutDashboard size={18}/>} label="Overview" active/>
                    <SidebarItem icon={<User size={18}/>} label="Profile"/>
                    <SidebarItem icon={<Settings size={18}/>} label="Configuration"/>
                </nav>

                <div className="pt-6 border-t">
                    <SidebarItem icon={<LogOut size={18}/>} label="Logout" danger/>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col">

                {/* DASHBOARD HEADER */}
                <header className="h-16 border-b bg-white flex items-center justify-between px-6 md:px-12">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative w-full max-w-xs hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4"/>
                            <input
                                className="w-full bg-slate-50 border-none rounded-full pl-10 pr-4 py-2 text-xs focus:ring-1 focus:ring-blue-500"
                                placeholder="Search audit logs..."/>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell size={20} className="text-slate-500"/>
                            <span
                                className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"/>
                        </Button>
                        <div
                            className="w-8 h-8 rounded-full bg-linear-to-tr from-slate-200 to-slate-300 border border-slate-300"/>
                    </div>
                </header>

                {/* CONTENT CONTAINER */}
                <div className="p-6 md:p-12 max-w-5xl mx-auto w-full space-y-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-slate-900">Verification Hub</h1>
                            <p className="text-slate-500 text-sm">Reviewing individual identity session logs.</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="rounded-full gap-2">
                                <Download size={14}/> Export Report
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-full gap-2">
                                <Share2 size={14}/> Share
                            </Button>
                        </div>
                    </div>

                    <Results/>
                </div>
            </main>
        </div>
    );
}

function SidebarItem({icon, label, active = false, danger = false}: any) {
    return (
        <div className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer font-medium transition-all text-sm",
            active ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-50",
            danger && "hover:bg-rose-50 hover:text-rose-600"
        )}>
            {icon}
            {label}
        </div>
    );
}