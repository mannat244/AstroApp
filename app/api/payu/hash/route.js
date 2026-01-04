import { NextResponse } from 'next/server';
import { generatePayUHash } from '@/lib/payu';

export async function POST(req) {
    try {
        const body = await req.json();
        const { txnid, amount, productinfo, firstname, email } = body;

        const key = process.env.PAYU_MERCHANT_KEY;
        const salt = process.env.PAYU_MERCHANT_SALT;

        if (!key || !salt) {
            return NextResponse.json({ error: "Server misconfiguration: Missing PayU credentials" }, { status: 500 });
        }

        const hash = generatePayUHash({
            key,
            txnid,
            amount,
            productinfo,
            firstname,
            email,
            salt
        });

        return NextResponse.json({ hash, key });
    } catch (error) {
        console.error("Hash Generation Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
