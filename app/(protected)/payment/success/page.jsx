"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const txnid = searchParams.get("txnid");
    const [status, setStatus] = useState("verifying"); // verifying, confirmed, failed
    const [booking, setBooking] = useState(null);

    useEffect(() => {
        if (!txnid) {
            setStatus("failed");
            return;
        }

        // 1. Live Listen to Firestore (Faster if Webhook hits first)
        const bookingRef = doc(db, "bookings", txnid);

        const unsubscribe = onSnapshot(bookingRef, async (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setBooking(data);

                if (data.status === "confirmed") {
                    setStatus("confirmed");
                } else if (data.status === "failed") {
                    setStatus("failed");
                } else if (data.status === "initiated") {
                    // 2. If still initiated, trigger Manual Verify API
                    // We debounce this slightly to allow webhook a chance
                    verifyPayment(txnid);
                }
            }
        });

        return () => unsubscribe();
    }, [txnid]);

    const verifyPayment = async (id) => {
        try {
            const res = await fetch('/api/payu/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ txnid: id })
            });
            const data = await res.json();
            if (data.status === "confirmed") {
                setStatus("confirmed");
            }
        } catch (error) {
            console.error("Verification failed", error);
        }
    };

    if (status === "verifying") {
        return (
            <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center text-white p-4">
                <Loader2 className="size-12 text-primary-gold animate-spin mb-4" />
                <h1 className="text-xl font-bold">Verifying Payment...</h1>
                <p className="text-white/50">Please do not close this window.</p>
            </div>
        );
    }

    if (status === "failed") {
        return (
            <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center text-white p-4">
                <div className="size-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                    <AlertCircle className="size-8 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Payment Verification Failed</h1>
                <p className="text-white/50 mb-8 text-center max-w-md">
                    We couldn't verify your payment. If money was deducted, it will be refunded automatically within 5-7 days.
                </p>
                <div className="flex gap-4">
                    <Button variant="outline" onClick={() => router.push('/book')}>Try Again</Button>
                    <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center text-white p-4">
            <div className="size-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6 animate-in zoom-in duration-300">
                <CheckCircle className="size-10 text-green-500" />
            </div>

            <h1 className="text-3xl font-bold mb-2 text-center">Booking Confirmed!</h1>
            <p className="text-white/50 mb-8 text-center">Your appointment has been successfully scheduled.</p>

            {booking && (
                <div className="bg-white/5 rounded-2xl p-6 w-full max-w-md border border-white/10 mb-8">
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-white/50">Service</span>
                            <span className="font-semibold">{booking.serviceName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/50">Date</span>
                            <span className="font-semibold">{format(new Date(booking.date), "PPP")}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/50">Time</span>
                            <span className="font-semibold">{booking.time}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/50">Amount</span>
                            <span className="font-semibold text-primary-gold">₹{booking.amount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/50">Transaction ID</span>
                            <span className="font-mono text-xs p-1 bg-black/30 rounded text-white/70">{booking.id}</span>
                        </div>
                        {booking.paymentId && (
                            <div className="flex justify-between">
                                <span className="text-white/50">Payment Ref</span>
                                <span className="font-mono text-xs p-1 bg-primary-gold/10 text-primary-gold rounded">{booking.paymentId}</span>
                            </div>
                        )}
                        {booking.paymentMode && (
                            <div className="flex justify-between">
                                <span className="text-white/50">Mode</span>
                                <span className="font-semibold text-sm">{booking.paymentMode}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="flex gap-4">
                <Button className="bg-zinc-800 text-white hover:bg-zinc-700" onClick={() => window.print()}>Print Receipt</Button>
                <Button className="bg-primary-gold text-black hover:bg-primary-gold/90" onClick={() => router.push('/dashboard')}>
                    Go to Dashboard
                </Button>
            </div>
        </div>
    );
}
