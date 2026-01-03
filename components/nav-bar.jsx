"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, User, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Bookings", href: "/bookings", icon: Calendar },
    { label: "Profile", href: "/profile", icon: User },
];

export function NavBar() {
    const pathname = usePathname();

    return (
        <>
            {/* Desktop Top Bar */}
            <nav className="hidden md:flex fixed top-0 left-0 right-0 h-16 bg-bg-light/80 backdrop-blur-md border-b border-white/5 z-50 items-center justify-between px-8">
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-primary-gold flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                        <span className="text-black font-bold text-sm font-serif">VR</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-bold tracking-widest leading-none text-sm">VINNAY RAAJ</span>
                        <span className="text-primary-gold text-[0.5rem] uppercase tracking-[0.25em] font-medium">Astro & Vastu</span>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/book");
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary-gold",
                                    isActive ? "text-primary-gold" : "text-white/60"
                                )}
                            >
                                <Icon className="size-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Mobile Bottom Bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-bg-dark/95 backdrop-blur-md border-t border-white/5 z-50 rounded-t-[2rem] px-6 flex items-center justify-between shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/book");
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex flex-col items-center gap-1 min-w-[64px]"
                        >
                            <div
                                className={cn(
                                    "p-2 rounded-xl transition-all",
                                    isActive ? "bg-primary-gold/20 text-primary-gold" : "text-white/40 group-hover:text-white"
                                )}
                            >
                                <Icon className="size-6" />
                            </div>
                            <span
                                className={cn(
                                    "text-[10px] font-medium transition-colors",
                                    isActive ? "text-primary-gold" : "text-white/40"
                                )}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}
