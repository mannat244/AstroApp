"use client";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentFailurePage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center text-white p-4">
            <div className="size-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                <AlertCircle className="size-10 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
            <p className="text-white/50 mb-8 text-center max-w-md">
                The transaction was declined or cancelled. No money has been deducted from your account.
            </p>
            <div className="flex gap-4">
                <Button variant="outline" onClick={() => router.push('/book')}>Try Again</Button>
                <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
            </div>
        </div>
    );
}
