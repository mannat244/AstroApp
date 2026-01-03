"use client";

import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { MapPin, Video, Copy, CheckCircle, Calendar, User, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export function BookingTicket({ booking, children }) {
    const [open, setOpen] = useState(false);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Booking ID copied to clipboard");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="bg-transparent border-none shadow-none max-w-sm w-full p-4" aria-describedby={undefined}>
                <div className="relative bg-[#0F0F0F] rounded-2xl border border-primary-gold/20 shadow-2xl shadow-black/50 overflow-hidden">
                    {/* Decorative Background Glow */}
                    <div className="absolute -top-20 -right-20 size-40 bg-primary-gold/10 blur-[50px] rounded-full pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 size-40 bg-primary-gold/5 blur-[50px] rounded-full pointer-events-none" />

                    {/* Header */}
                    <div className="relative p-6 px-8 border-b border-white/5 bg-white/[0.02]">
                        <div className="flex flex-col items-center gap-3">
                            <div className="size-12 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.15)]">
                                <CheckCircle className="size-6 text-green-500" />
                            </div>
                            <div className="text-center space-y-1">
                                <DialogTitle className="text-white font-bold text-lg tracking-wide">Booking Confirmed</DialogTitle>
                                <p className="text-white/40 text-xs font-medium uppercase tracking-widest">Official Receipt</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="p-8 space-y-8 relative z-10">
                        {/* Service Title */}
                        <div className="text-center space-y-2">
                            <h3 className="text-primary-gold text-2xl font-serif font-bold leading-tight">
                                {booking.serviceName || "Astrology Session"}
                            </h3>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                                <span className={cn(
                                    "size-2 rounded-full",
                                    booking.status === 'confirmed' ? "bg-green-500 animate-pulse" : "bg-yellow-500"
                                )} />
                                <span className="text-[10px] uppercase font-bold text-white/70 tracking-wider">
                                    {booking.status}
                                </span>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                                <div className="space-y-1">
                                    <p className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-white/30">
                                        <Calendar className="size-3" /> Date
                                    </p>
                                    <p className="text-sm font-medium text-white/90">
                                        {booking.date ? format(new Date(booking.date), "MMM d, yyyy") : "TBD"}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-white/30">
                                        <Clock className="size-3" /> Time
                                    </p>
                                    <p className="text-sm font-medium text-white/90">
                                        {booking.time || "--:--"}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-white/30">
                                        {booking.mode === 'online' ? <Video className="size-3" /> : <MapPin className="size-3" />} Type
                                    </p>
                                    <p className="text-sm font-medium text-white/90 capitalize">
                                        {booking.mode}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-white/30">
                                        <User className="size-3" /> Client
                                    </p>
                                    <p className="text-sm font-medium text-white/90 truncate max-w-[120px]">
                                        {booking.userName || "Guest"}
                                    </p>
                                </div>
                            </div>

                            {/* Divider with ID */}
                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="w-full border-t border-white/10" />
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-[#0F0F0F] px-2 text-[10px] text-white/30 uppercase tracking-widest">
                                        Booking ID
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => copyToClipboard(booking.id)}
                                className="w-full group bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-xl p-3 flex items-center justify-between gap-2 transition-all"
                            >
                                <code className="font-mono text-xs text-primary-gold/80 font-semibold tracking-wide break-all">
                                    {booking.id}
                                </code>
                                <Copy className="size-4 text-white/20 group-hover:text-white/60 transition-colors flex-shrink-0" />
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-black/40 p-4 text-center border-t border-white/5">
                        <p className="text-[10px] text-white/30">
                            Please present this receipt if requested or keep for your records.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
