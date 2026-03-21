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

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "stk"; // Default to STK
    const body = await req.json();

    const mpesa = new MpesaService(apiKey.isLive);
    let mpesaResponse;
    let transactionType: any = "STK_PUSH";

    // 2. Route based on transaction type
    switch (type) {
      case "stk":
        const { phoneNumber, amount, accountReference, transactionDesc } = body;
        if (!phoneNumber || !amount || !accountReference) {
          return NextResponse.json({ error: "Missing required fields for STK Push" }, { status: 400 });
        }
        const baseUrl = process.env.NEXTAUTH_URL?.includes("localhost") 
          ? "https://test-callback.mwenaro.com" 
          : process.env.NEXTAUTH_URL;
          
        mpesaResponse = await mpesa.stkPush({
          phoneNumber,
          amount,
          accountReference,
          transactionDesc: transactionDesc || "PlugPay Transaction",
          callbackUrl: `${baseUrl}/api/v1/callbacks/stk`,
        });
        transactionType = "STK_PUSH";
        break;

      case "b2c":
        const { b2cAmount, b2cReceiver, b2cRemarks } = body;
        if (!b2cAmount || !b2cReceiver) {
          return NextResponse.json({ error: "Missing fields for B2C" }, { status: 400 });
        }
        mpesaResponse = await mpesa.b2cPayment({
          initiatorName: "PlugPayAuto",
          amount: b2cAmount,
          partyA: "123456", // Shortcode from config
          partyB: b2cReceiver,
          remarks: b2cRemarks || "B2C Payout",
        });
        transactionType = "B2C";
        break;

      case "c2c":
        const { senderPhone, receiverPhone, c2cAmount, c2cRemarks } = body;
        if (!senderPhone || !receiverPhone || !c2cAmount) {
          return NextResponse.json({ error: "Missing required fields for C2C" }, { status: 400 });
        }
        mpesaResponse = await mpesa.c2cPayment({
          senderPhone,
          receiverPhone,
          amount: c2cAmount,
          remarks: c2cRemarks || "C2C Transfer",
        });
        transactionType = "C2C";
        break;

      case "c2b-register":
        mpesaResponse = await mpesa.c2bRegisterUrl({
          shortCode: body.shortCode,
          confirmationUrl: `${process.env.NEXTAUTH_URL}/api/v1/callbacks/c2b/confirm`,
          validationUrl: `${process.env.NEXTAUTH_URL}/api/v1/callbacks/c2b/validate`,
        });
        return NextResponse.json(mpesaResponse);

      default:
        return NextResponse.json({ error: "Unsupported transaction type" }, { status: 400 });
    }

    // 3. Log transaction in SQLite
    const transactionId = crypto.randomUUID();
    await logTransaction({
      id: transactionId,
      userId: apiKey.userId.toString(),
      apiKeyId: apiKey._id.toString(),
      type: transactionType,
      status: "PENDING",
      amount: parseFloat(body.amount || body.b2cAmount || body.c2cAmount || 0),
      phoneNumber: body.phoneNumber || body.b2cReceiver || body.senderPhone || "N/A",
      rawPayload: mpesaResponse as any,
    });

    return NextResponse.json({
      success: true,
      transactionId,
      ...mpesaResponse,
    });

  } catch (error: any) {
    console.error("Payment API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
