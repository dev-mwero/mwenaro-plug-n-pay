import { verifyPublicApiKey } from "@/lib/services/api-auth";
import { MpesaService } from "@/lib/services/mpesa";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const apiKey = await verifyPublicApiKey(req);
    if (!apiKey) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // balance or status
    const mpesa = new MpesaService(apiKey.isLive);

    if (type === "balance") {
      const res = await mpesa.getAccountBalance({ shortCode: "123456" });
      return NextResponse.json(res);
    }

    if (type === "status") {
      const transactionId = searchParams.get("id");
      if (!transactionId) return NextResponse.json({ error: "Transaction ID required" }, { status: 400 });
      const res = await mpesa.getTransactionStatus({ transactionId, shortCode: "123456" });
      return NextResponse.json(res);
    }

    return NextResponse.json({ error: "Module not found" }, { status: 404 });

  } catch (e) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
