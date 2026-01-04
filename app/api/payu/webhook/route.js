import { NextResponse } from 'next/server';
import { verifyPayUHash } from '@/lib/payu';
import { db } from '@/lib/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

export async function POST(req) {
    try {
        // PayU sends data as URL-encoded form data
        const formData = await req.formData();
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        const { status, txnid, amount, productinfo, firstname, email, hash: responseHash, mihpayid } = data;
        const key = process.env.PAYU_MERCHANT_KEY;
        const salt = process.env.PAYU_MERCHANT_SALT;

        if (!key || !salt) {
            console.error("Webhook Error: Missing PayU credentials");
            return NextResponse.json({ error: "Config Error" }, { status: 500 });
        }

        // 1. Verify Hash
        const isValid = verifyPayUHash({
            key,
            salt,
            status,
            txnid,
            amount,
            productinfo,
            firstname,
            email,
            responseHash
        });

        if (!isValid) {
            console.error("Webhook Error: Invalid Hash for txnid", txnid);
            return NextResponse.json({ error: "Invalid Hash" }, { status: 400 });
        }

        // 2. Update Firestore
        const bookingRef = doc(db, "bookings", txnid);
        const bookingDoc = await getDoc(bookingRef);

        if (!bookingDoc.exists()) {
            console.error("Webhook Error: Booking not found", txnid);
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        const currentStatus = bookingDoc.data().status;

        // Prevent reverting a confirmed status (idempotency)
        if (currentStatus === "confirmed" && status === "success") {
            return NextResponse.json({ message: "Already Confirmed" });
        }

        if (status === "success") {
            await updateDoc(bookingRef, {
                status: "confirmed",
                paymentId: mihpayid, // PayU's ID
                paymentMode: data.mode,
                updatedAt: new Date().toISOString()
            });
        } else {
            await updateDoc(bookingRef, {
                status: "failed",
                failureReason: data.error_Message || "Transaction Failed",
                updatedAt: new Date().toISOString()
            });
        }

        // Return 200 OK to PayU
        return NextResponse.json({ message: "Webhook received" });

    } catch (error) {
        console.error("Webhook Handling Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
