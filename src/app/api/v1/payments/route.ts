import { verifyPublicApiKey } from "@/lib/services/api-auth";
import { MpesaService } from "@/lib/services/mpesa";
import { logTransaction } from "@/lib/db/sqlite";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    // 1. Verify API Key
    const apiKey = await verifyPublicApiKey(req);
    if (!apiKey) {
      return NextResponse.json({ error: "Invalid or inactive API Key" }, { status: 401 });
    }

    const body = await req.json();
    const { phoneNumber, amount, accountReference, transactionDesc } = body;

    // 2. Validate Body
    if (!phoneNumber || !amount || !accountReference) {
      return NextResponse.json({ error: "Missing required fields (phoneNumber, amount, accountReference)" }, { status: 400 });
    }

    // 3. Initiate M-Pesa Request
    const mpesa = new MpesaService(apiKey.isLive);
    const mpesaResponse = await mpesa.stkPush({
      phoneNumber,
      amount,
      accountReference,
      transactionDesc: transactionDesc || "PlugPay Transaction",
      callbackUrl: `${process.env.NEXTAUTH_URL}/api/v1/callbacks/stk`,
    });

    // 4. Log initial PENDING transaction in SQLite
    const transactionId = crypto.randomUUID();
    logTransaction({
      id: transactionId,
      userId: apiKey.userId.toString(),
      apiKeyId: apiKey._id.toString(),
      type: "STK_PUSH",
      status: "PENDING",
      amount: parseFloat(amount),
      phoneNumber,
      rawPayload: mpesaResponse,
    });

    return NextResponse.json({
      success: true,
      transactionId,
      message: mpesaResponse.CustomerMessage,
      checkoutRequestId: mpesaResponse.CheckoutRequestID,
    });

  } catch (error: any) {
    console.error("Payment API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
