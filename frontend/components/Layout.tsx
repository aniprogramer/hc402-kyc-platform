import Header from "@/components/Header";
import Footer from "@/components/Footer";
import React from "react";

export default function Layout({children}: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header/>
            <main className="grow px-4 py-6">{children}</main>
            <Footer/>
        </div>
    );
}
