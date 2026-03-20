import { MpesaService } from "@/lib/services/mpesa";
import { getSqliteDb } from "@/lib/db/sqlite";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("[CALLBACK] Received M-Pesa Callback:", JSON.stringify(body));

    const mpesa = new MpesaService();
    const result = mpesa.decodeCallback(body);

    if (!result) {
      return NextResponse.json({ error: "Invalid callback payload" }, { status: 400 });
    }

    const { checkoutRequestId, success, resultDesc, mpesaReceiptNumber } = result;

    // 1. Find and Update the transaction in SQLite
    const db = await getSqliteDb();
    
    // Note: In a real scenario, we'd index by CheckoutRequestID directly in SQLite
    // Here we search for the CheckoutRequestID within the rawPayload string as a simple fallback
    await db.execute({
      sql: `
        UPDATE transaction_logs 
        SET status = ?, mpesaReceiptNumber = ?, errorMessage = ?
        WHERE id IN (
          SELECT id FROM transaction_logs 
          WHERE rawPayload LIKE ? 
          ORDER BY createdAt DESC LIMIT 1
        )
      `,
      args: [
        success ? "SUCCESS" : "FAILED",
        mpesaReceiptNumber || null,
        success ? null : resultDesc,
        `%${checkoutRequestId}%`
      ]
    });

    // 2. TODO: If the user has a webhook URL configured, notify them here.
    
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });

  } catch (error: any) {
    console.error("Callback Error:", error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Internal Error" });
  }
}
