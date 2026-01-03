"use client";

import { Sparkles, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";

export function PaymentSummary({
    selectedService,
    beneficiary,
    formData,
    date,
    time,
    handlePayment,
    loading,
    onBack
}) {
    return (
        <div className="max-w-md mx-auto animate-in fade-in zoom-in-95 duration-500 pb-40 md:pb-0 relative">
            {/* Mobile Back Button */}
            <div className="md:hidden w-full flex justify-start mb-2">
                <Button onClick={onBack} variant="ghost" size="sm" className="text-white/60 hover:text-white pl-0 -ml-2">
                    <ChevronLeft className="size-4 mr-1" /> Back
                </Button>
            </div>

            <Card className="bg-white/5 border-white/10 backdrop-blur-xl border-t-4 border-t-primary-gold overflow-hidden">
                <CardHeader className="bg-black/20 pb-6 pt-6 text-center">
                    <div className="mx-auto bg-primary-gold/20 w-16 h-16 rounded-full flex items-center justify-center mb-2">
                        <Sparkles className="size-8 text-primary-gold" />
                    </div>
                    <CardTitle className="text-2xl text-white">Confirm Booking</CardTitle>
                    <CardDescription className="text-white/60">One last step to secure your slot</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-white/10">
                            <span className="text-white/60 text-sm font-medium">Service</span>
                            <span className="font-bold text-sm text-right max-w-[60%] text-white">{selectedService.name}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-white/10">
                            <span className="text-white/60 text-sm font-medium">For</span>
                            <span className="font-bold text-sm capitalize text-white">{beneficiary === "self" ? "Myself" : formData.name}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-white/10">
                            <span className="text-white/60 text-sm font-medium">Appointment</span>
                            <span className="font-bold text-sm text-right text-white">
                                {date && format(date, "MMM d, yyyy")} <span className="text-white/30">•</span> {time}
                            </span>
                        </div>
                        <div className="pt-4 flex justify-between items-end">
                            <div className="text-left">
                                <div className="text-xs text-white/60 mb-1 font-medium">Total Amount</div>
                                <div className="text-2xl font-bold text-primary-gold">₹{selectedService.price}</div>
                            </div>
                            <div className="text-sm text-white/40 line-through pb-1">₹{selectedService.originalPrice}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Floating Action Bar */}
            <div className="fixed bottom-20 left-0 right-0 p-4 pt-10 z-40 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/90 to-transparent md:static md:bg-none md:p-0 md:mt-8">
                <div className="flex items-center justify-between md:justify-center gap-4 max-w-md mx-auto">

                    {/* Desktop Back Button (Matched to DateTimeSelection) */}
                    <div className="hidden md:block absolute left-0 md:static">
                        <Button onClick={onBack} variant="ghost" className="text-white/60 hover:text-white">
                            Back
                        </Button>
                    </div>

                    {/* Mobile Price Summary */}
                    <div className="md:hidden">
                        <span className="text-xs text-white/40 block">Total to Pay</span>
                        <span className="text-xl font-bold text-primary-gold">₹{selectedService.price}</span>
                    </div>

                    <Button
                        onClick={handlePayment}
                        disabled={loading}
                        className="bg-primary-gold text-black rounded-full px-8 py-6 text-lg font-bold shadow-glow-gold hover:scale-105 hover:bg-primary-gold transition-all ml-auto md:ml-0 md:w-full md:max-w-xs"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="size-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                Processing...
                            </div>
                        ) : "Pay & Book"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
