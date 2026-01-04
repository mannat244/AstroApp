"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Sparkles, Video, Calendar, Clock, MapPin, Ticket } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { BookingTicket } from "./components/BookingTicket";

export default function BookingsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [bookings, setBookings] = useState([]);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
            return;
        }

        const fetchBookings = async () => {
            if (!user) return;
            try {
                const q = query(
                    collection(db, "bookings"),
                    where("userId", "==", user.uid)
                );

                const querySnapshot = await getDocs(q);
                const fetched = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Client-side sort
                fetched.sort((a, b) => new Date(b.date) - new Date(a.date));

                setBookings(fetched);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            } finally {
                setFetching(false);
            }
        };

        if (!loading) {
            fetchBookings();
        }
    }, [user, loading, router]);

    if (loading || fetching) {
        return (
            <div className="flex min-h-screen bg-bg-dark items-center justify-center">
                <Sparkles className="size-8 text-primary-gold animate-pulse" />
            </div>
        );
    }

    return (
        <main className="px-6 py-8 md:px-12 md:py-10 max-w-7xl mx-auto min-h-[80vh]">
            <header className="mb-8">
                <h1 className="text-white text-2xl font-bold mb-2">My Bookings</h1>
                <p className="text-white/50 text-sm">Your upcoming and past consultations.</p>
            </header>

            {bookings.length === 0 ? (
                <Card className="bg-surface border-white/5 text-center p-12">
                    <CardContent className="flex flex-col items-center gap-4">
                        <div className="size-16 bg-white/5 rounded-full flex items-center justify-center">
                            <Calendar className="size-8 text-white/20" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">No bookings yet</h3>
                            <p className="text-white/40 text-sm">Schedule your first session today.</p>
                        </div>
                        <Button
                            onClick={() => router.push("/book")}
                            className="bg-primary-gold text-black hover:bg-primary-light font-bold"
                        >
                            Book a Consultation
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {bookings.map((booking) => (
                        <Card key={booking.id} className="bg-neutral-900 border-white/5 overflow-hidden hover:border-primary-gold/30 transition-all duration-300 group flex flex-col">
                            <CardHeader className="pb-4 border-b border-white/5 bg-neutral-900">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="space-y-1.5">
                                        <CardTitle className="text-lg text-white font-bold leading-tight">
                                            {booking.serviceName || booking.category || "Consultation"}
                                        </CardTitle>
                                        <p className="text-xs text-white/50 font-medium">
                                            Booked by <span className="text-white/90">{booking.userName || "Guest"}</span>
                                        </p>
                                    </div>
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border",
                                        booking.status === 'confirmed'
                                            ? "bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]"
                                            : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                    )}>
                                        {booking.status}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-5 space-y-5 flex-1">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Date</p>
                                        <div className="text-sm text-white/90 flex flex-col">
                                            <span className="font-bold">{format(new Date(booking.date), "MMM d, yyyy")}</span>
                                            <span className="text-white/60 font-medium">{booking.time}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Mode</p>
                                        <div className="text-sm text-white/90 flex items-center gap-2">
                                            {booking.mode === 'online' ? (
                                                <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                                                    <Video className="size-3.5 text-primary-gold" />
                                                    <span className="font-medium">Online</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                                                    <MapPin className="size-3.5 text-primary-gold" />
                                                    <span className="font-medium">In-Person</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                    <div className="font-mono text-[10px] text-white/20">
                                        ID: {booking.id ? booking.id.slice(0, 12).toUpperCase() : "..."}
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="p-4 pt-0 gap-3 grid grid-cols-2">
                                <BookingTicket booking={booking}>
                                    <Button variant="outline" className="w-full bg-transparent border-white/10 text-white hover:bg-white/5 hover:text-white hover:border-white/20">
                                        <Ticket className="size-4 mr-2 text-primary-gold" />
                                        View Booking
                                    </Button>
                                </BookingTicket>

                                {booking.meetingLink && booking.status === 'confirmed' ? (
                                    <Button
                                        onClick={() => window.open(booking.meetingLink, "_blank")}
                                        className="w-full bg-primary-gold/10 text-primary-gold hover:bg-primary-gold hover:text-black border border-primary-gold/20 hover:border-transparent transition-all"
                                    >
                                        <Video className="size-4 mr-2" />
                                        Join Video
                                    </Button>
                                ) : (
                                    <Button disabled className="w-full bg-white/5 text-white/20 border border-white/5 cursor-not-allowed">
                                        <Clock className="size-4 mr-2" />
                                        Wait for time
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </main>
    );
}
