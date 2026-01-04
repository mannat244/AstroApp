"use client";

import { useAdmin } from "@/hooks/useAdmin";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sparkles, Users, Calendar, Shield, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingsTab } from "@/components/admin/BookingsTab";
import { UsersTab } from "@/components/admin/UsersTab";
import { ServicesTab } from "@/components/admin/ServicesTab";

export default function AdminPage() {
    const { isAdmin, loading, user } = useAdmin();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAdmin) {
            router.push("/dashboard");
        }
    }, [isAdmin, loading, router]);

    if (loading) {
        return (
            <div className="flex min-h-screen bg-bg-dark items-center justify-center">
                <Sparkles className="size-8 text-primary-gold animate-pulse" />
            </div>
        );
    }

    if (!isAdmin) return null;

    return (
        <div className="min-h-screen bg-bg-dark text-white font-sans">
            {/* Header */}
            <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-primary-gold/20 flex items-center justify-center border border-primary-gold/30">
                                <Shield className="size-5 text-primary-gold" />
                            </div>
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-white">Admin Dashboard</h1>
                                <p className="text-xs text-white/60">Manage bookings and users</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-right hidden md:block">
                                <p className="text-sm text-white font-medium">{user?.displayName}</p>
                                <p className="text-xs text-white/40">{user?.email}</p>
                            </div>
                            <img
                                src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&background=D4AF37&color=000`}
                                alt={user?.displayName}
                                className="size-10 rounded-full border-2 border-primary-gold/30"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <Tabs defaultValue="bookings" className="w-full">
                    <TabsList className="bg-white/5 border border-white/10 mb-6 h-12">
                        <TabsTrigger
                            value="bookings"
                            className="gap-2 text-white data-[state=active]:bg-primary-gold data-[state=active]:text-black"
                        >
                            <Calendar className="size-4" />
                            <span className="hidden sm:inline">Bookings</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="users"
                            className="gap-2 text-white data-[state=active]:bg-primary-gold data-[state=active]:text-black"
                        >
                            <Users className="size-4" />
                            <span className="hidden sm:inline">Users</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="services"
                            className="gap-2 text-white data-[state=active]:bg-primary-gold data-[state=active]:text-black"
                        >
                            <Settings className="size-4" />
                            <span className="hidden sm:inline">Services</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="bookings" className="mt-0">
                        <BookingsTab />
                    </TabsContent>

                    <TabsContent value="users" className="mt-0">
                        <UsersTab />
                    </TabsContent>

                    <TabsContent value="services" className="mt-0">
                        <ServicesTab />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
