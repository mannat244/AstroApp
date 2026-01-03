"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { NavBar } from "@/components/nav-bar";
import { Sparkles } from "lucide-react";

export default function ProtectedLayout({ children }) {
    const { user, userProfile, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/");
            } else if (!userProfile?.onboarded) {
                router.push("/onboarding");
            }
        }
    }, [user, userProfile, loading, router]);

    if (loading) {
        return (
            <div className="flex min-h-screen bg-bg-dark items-center justify-center">
                <Sparkles className="size-8 text-primary-gold animate-pulse" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-bg-dark font-sans pb-24 md:pb-0 md:pt-16">
            <NavBar />
            {children}
        </div>
    );
}
