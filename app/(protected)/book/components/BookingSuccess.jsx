"use client";

import { CheckCircle, Video, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function BookingSuccess({ bookingDetails, addToGoogleCalendar }) {
    const router = useRouter();

    return (
        <div className="max-w-md mx-auto text-center animate-in fade-in zoom-in-95 duration-500 pt-10">
            <div className="size-28 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto mb-8 ring-1 ring-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.1)]">
                <CheckCircle className="size-14" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Booking Confirmed!</h1>
            <p className="text-white/60 mb-10 leading-relaxed text-lg">
                You're all set! Your session for <br /><strong className="text-white">{bookingDetails.serviceName}</strong> has been scheduled.
            </p>

            {/* Booking ID Badge */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 flex items-center justify-between mx-auto max-w-xs md:max-w-full">
                <span className="text-sm text-white/50 font-medium">Booking ID</span>
                <code className="text-primary-gold font-mono font-bold tracking-widest bg-black/40 px-3 py-1 rounded-lg border border-white/5">
                    #{bookingDetails.id ? bookingDetails.id.slice(0, 8).toUpperCase() : "PENDING"}
                </code>
            </div>

            {bookingDetails.meetingLink ? (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-left relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary-gold" />
                    <p className="text-xs text-white/40 uppercase tracking-widest mb-3 font-semibold">Video Meeting Link</p>
                    <div className="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-white/5 group-hover:border-primary-gold/20 transition-colors">
                        <div className="bg-white/10 p-2 rounded-lg">
                            <Video className="size-5 text-primary-gold" />
                        </div>
                        <code className="text-sm flex-1 text-left truncate text-primary-gold/90 font-mono">{bookingDetails.meetingLink}</code>
                    </div>
                </div>
            ) : (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-left relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary-gold" />
                    <p className="text-xs text-white/40 uppercase tracking-widest mb-3 font-semibold">Appointment Type</p>
                    <div className="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-white/5 group-hover:border-primary-gold/20 transition-colors">
                        <div className="bg-white/10 p-2 rounded-lg">
                            <MapPin className="size-5 text-primary-gold" />
                        </div>
                        <span className="text-sm flex-1 text-left font-bold text-white">In-Person Consultation</span>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <Button onClick={() => router.push("/dashboard")} variant="outline" className="border-white/10 bg-neutral-800 h-12 rounded-xl text-white">
                    Go to Dashboard
                </Button>
                <Button onClick={addToGoogleCalendar} className="bg-primary-gold text-black h-12 rounded-xl font-bold hover:bg-yellow-400">
                    Add to Calendar
                </Button>
            </div>
        </div>
    );
}
