"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, CheckCircle, ChevronRight, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export function DateTimeSelection({
    date,
    setDate,
    time,
    setTime,
    timeSlots,
    bookedSlots = [], // Default to empty
    onBack,
    onNext
}) {
    // Accordion State
    const [isCalendarOpen, setIsCalendarOpen] = useState(!date);

    // Re-open if date is cleared (e.g. by parent)
    useEffect(() => {
        if (!date) setIsCalendarOpen(true);
    }, [date]);

    const handleDateSelect = (d) => {
        // Required logic: d might be undefined if re-clicked, but we treat it as confirm
        if (d || date) {
            if (d) setDate(d);
            setIsCalendarOpen(false); // Auto-collapse
        }
    };

    // Calculate available slots
    const availableCount = timeSlots.filter(s => !bookedSlots.includes(s)).length;

    return (
        <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500 pb-40 md:pb-0">
            <h2 className="text-xl md:text-2xl font-bold mb-8 text-center text-white">Select Date & Time</h2>

            <div className="space-y-6">
                {/* Date Accordion */}
                <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden transition-all duration-300">
                    {/* Accordion Header / Summary */}
                    <div
                        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                        className={cn(
                            "p-6 flex items-center justify-between cursor-pointer transition-colors hover:bg-white/5",
                            isCalendarOpen ? "bg-white/5" : ""
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <div className={cn("p-2 rounded-full", date ? "bg-primary-gold text-black" : "bg-white/10 text-white")}>
                                <CalendarIcon className="size-5" />
                            </div>
                            <div>
                                <p className="text-sm text-white/40 font-medium uppercase tracking-wider">Date</p>
                                <p className="text-lg font-bold text-white">
                                    {date ? format(date, "EEE, d MMM yyyy") : "Select a Date"}
                                </p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-white/40 hover:text-white">
                            {isCalendarOpen ? <ChevronRight className="rotate-90 transition-transform" /> : <Edit2 className="size-4" />}
                        </Button>
                    </div>

                    {/* Collapsible Content */}
                    <div className={cn(
                        "transition-all duration-300 ease-in-out overflow-hidden bg-black/20",
                        isCalendarOpen ? "max-h-[500px] opacity-100 border-t border-white/10" : "max-h-0 opacity-0"
                    )}>
                        <div className="p-6 flex justify-center">
                            {/* Standard Calendar Component (Preserved "Out of Box" styles) */}
                            <Calendar
                                mode="single"
                                required
                                selected={date}
                                onSelect={handleDateSelect}
                                disabled={(date) => {
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    const thirtyDaysFromNow = new Date();
                                    thirtyDaysFromNow.setDate(today.getDate() + 30);
                                    return date < today || date > thirtyDaysFromNow;
                                }}
                                className="rounded-xl border border-white/5 bg-transparent text-white"
                                classNames={{
                                    day_selected: "bg-primary-gold text-black hover:bg-primary-gold hover:text-black focus:bg-primary-gold focus:text-black",
                                    day_today: "bg-white text-black font-bold hover:bg-white/90",
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Time Slots (Only visible if Date selected) */}
                {date && (
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="bg-white/10 p-2 rounded-full text-white">
                                <CheckCircle className="size-5" />
                            </div>
                            <div>
                                <p className="text-sm text-white/40 font-medium uppercase tracking-wider">Available Slots</p>
                                <p className="text-white font-bold">{availableCount} slots available</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {timeSlots.map((slot) => {
                                const isBooked = bookedSlots.includes(slot);
                                return (
                                    <button
                                        key={slot}
                                        disabled={isBooked}
                                        onClick={() => setTime(slot)}
                                        className={cn(
                                            "py-3 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-2",
                                            isBooked
                                                ? "bg-white/5 text-white/20 border-white/5 cursor-not-allowed line-through decoration-white/20"
                                                : time === slot
                                                    ? "bg-primary-gold text-black border-transparent shadow-[0_0_15px_rgba(212,175,55,0.3)] scale-[1.02]"
                                                    : "bg-black/20 border-white/10 text-white/80 hover:border-primary-gold/50 hover:text-white"
                                        )}
                                    >
                                        {slot}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Floating Action Bar */}
            <div className="fixed bottom-20 left-0 right-0 p-4 pt-10 z-40 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/90 to-transparent md:static md:bg-none md:p-0 md:mt-12">
                <div className="flex items-center justify-between md:justify-center gap-4 max-w-xl mx-auto">

                    {/* Back Button (Desktop: Inline, Mobile: Hidden) */}
                    <div className="hidden md:block absolute left-0 md:static">
                        <Button onClick={onBack} variant="ghost" className="text-white/60 hover:text-white top-0">
                            Back
                        </Button>
                    </div>

                    {/* Mobile Selection Summary */}
                    <div className="md:hidden">
                        {date && time ? (
                            <div className="flex flex-col">
                                <span className="text-xs text-white/40">{format(date, "MMM d")}</span>
                                <span className="text-xl font-bold text-primary-gold">{time}</span>
                            </div>
                        ) : (
                            <span className="text-sm text-white/40">Select Slot</span>
                        )}
                    </div>

                    <Button
                        onClick={onNext}
                        disabled={!date || !time}
                        className={cn(
                            "bg-primary-gold text-black rounded-full px-8 md:px-24 py-6 text-base md:text-lg font-bold shadow-glow-gold hover:scale-105 hover:bg-primary-gold transition-all flex items-center justify-center gap-2 ml-auto md:ml-0 md:min-w-[300px]",
                            (!date || !time) ? "opacity-50 cursor-not-allowed" : "opacity-100 scale-100"
                        )}
                    >
                        Proceed to Pay <ChevronRight className="size-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
