import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

export async function POST(req) {
    try {
        const { txnid } = await req.json();
        const key = process.env.PAYU_MERCHANT_KEY;
        const salt = process.env.PAYU_MERCHANT_SALT;
        const authHeader = process.env.PAYU_AUTH_HEADER; // Need to check if this is required or key/salt is enough.
        // For Verify Payment API (command: verify_payment), we post form data hash again.

        // Construct Verify Hash
        // command|var1|salt
        const command = "verify_payment";
        const hashStr = `${key}|${command}|${txnid}|${salt}`;
        const crypto = require('crypto');
        const hash = crypto.createHash('sha512').update(hashStr).digest('hex');

        // Call PayU API
        const formData = new URLSearchParams();
        formData.append('key', key);
        formData.append('command', command);
        formData.append('var1', txnid);
        formData.append('hash', hash);

        const payuUrl = "https://info.payu.in/merchant/postservice.php?form=2"; // Test & Live use same usually, or test URL? 
        // Docs say: https://test.payu.in/merchant/postservice?form=2 for test
        // Use env var for base URL logic
        const isTest = process.env.NEXT_PUBLIC_PAYU_BASE_URL.includes("test");
        const verifyUrl = isTest
            ? "https://test.payu.in/merchant/postservice?form=2"
            : "https://info.payu.in/merchant/postservice.php?form=2";

        const response = await fetch(verifyUrl, {
            method: 'POST',
            body: formData,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const data = await response.json();

        // data format: { status: 1, transaction_details: { [txnid]: { status: 'success', ... } } }
        if (data.status === 1 && data.transaction_details && data.transaction_details[txnid]) {
            const txnData = data.transaction_details[txnid];

            if (txnData.status === 'success') {
                // Confirmed!
                const bookingRef = doc(db, "bookings", txnid);
                await updateDoc(bookingRef, {
                    status: "confirmed",
                    paymentId: txnData.mihpayid,
                    paymentMode: txnData.mode,
                    updatedAt: new Date().toISOString()
                });
                return NextResponse.json({ status: "confirmed", data: txnData });
            }
        }

        return NextResponse.json({ status: "pending_or_failed", raw: data });

    } catch (error) {
        console.error("Verify API Error:", error);
        return NextResponse.json({ error: "Verify Failed" }, { status: 500 });
    }
}
