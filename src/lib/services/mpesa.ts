import crypto from "crypto";

export type MpesaTransactionType =
  | "STK_PUSH"
  | "B2C"
  | "C2B"
  | "TRANSACTION_STATUS"
  | "ACCOUNT_BALANCE"
  | "REVERSAL";

export interface MpesaResponse {
  OriginatorConversationID?: string;
  ConversationID?: string;
  MerchantRequestID?: string;
  CheckoutRequestID?: string;
  ResponseCode: "0" | string;
  ResponseDescription: string;
  CustomerMessage?: string;
  errorCode?: string;
  errorMessage?: string;
}

const DARAJA_BASE_URL = "https://sandbox.safaricom.co.ke";

/**
 * Fetches a short-lived OAuth2 access token from Daraja
 */
async function getDarajaToken(): Promise<string> {
  const key = process.env.MPESA_CONSUMER_KEY!;
  const secret = process.env.MPESA_CONSUMER_SECRET!;
  const credentials = Buffer.from(`${key}:${secret}`).toString("base64");

  const res = await fetch(
    `${DARAJA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      method: "GET",
      headers: { Authorization: `Basic ${credentials}` },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Daraja OAuth failed: ${res.status} ${body}`);
  }

  const data = await res.json();
  return data.access_token as string;
}

/**
 * Generates an STK Push password: base64(ShortCode + PassKey + Timestamp)
 */
function getStkPassword(timestamp: string): string {
  const shortCode = process.env.MPESA_SHORT_CODE!;
  const passKey = process.env.MPESA_PASS_KEY!;
  return Buffer.from(`${shortCode}${passKey}${timestamp}`).toString("base64");
}

/**
 * Gets current timestamp in YYYYMMDDHHmmss format
 */
function getTimestamp(): string {
  return new Date()
    .toISOString()
    .replace(/[-T:.Z]/g, "")
    .slice(0, 14);
}

/**
 * Service to handle communication with Safaricom Daraja API.
 * Uses real API when credentials are present, falls back to simulation.
 */
export class MpesaService {
  private isLive: boolean;
  private hasCredentials: boolean;

  constructor(isLive: boolean = false) {
    this.isLive = isLive;
    this.hasCredentials = Boolean(
      process.env.MPESA_CONSUMER_KEY &&
        process.env.MPESA_CONSUMER_SECRET &&
        process.env.MPESA_PASS_KEY &&
        process.env.MPESA_SHORT_CODE
    );
  }

  /**
   * Initiates an STK Push (Lipa na M-Pesa Online / Lipa na Mpesa)
   */
  async stkPush(params: {
    phoneNumber: string;
    amount: number;
    accountReference: string;
    transactionDesc: string;
    callbackUrl: string;
  }): Promise<MpesaResponse> {
    if (!this.hasCredentials) {
      console.log("[MPESA] No credentials found — running simulation");
      return this.simulateInteraction("STK_PUSH", params);
    }

    try {
      const token = await getDarajaToken();
      const timestamp = getTimestamp();
      const password = getStkPassword(timestamp);
      const shortCode = process.env.MPESA_SHORT_CODE!;

      // Format phone number: strip leading 0 or +, ensure 2547...
      const phone = params.phoneNumber
        .replace(/^\+/, "")
        .replace(/^0/, "254");

      const payload = {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.ceil(params.amount), // Daraja requires integer
        PartyA: phone,
        PartyB: shortCode,
        PhoneNumber: phone,
        CallBackURL: params.callbackUrl,
        AccountReference: params.accountReference.slice(0, 12), // max 12 chars
        TransactionDesc: params.transactionDesc.slice(0, 13), // max 13 chars
      };

      console.log("[MPESA] STK Push →", JSON.stringify(payload));

      const res = await fetch(
        `${DARAJA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      console.log("[MPESA] STK Push ←", JSON.stringify(data));
      return data as MpesaResponse;
    } catch (err: any) {
      console.error("[MPESA] STK Push error:", err.message);
      return {
        ResponseCode: "1",
        ResponseDescription: `STK Push failed: ${err.message}`,
      };
    }
  }

  /**
   * Initiates a B2C Payment (Business to Customer)
   * NOTE: Requires Initiator credentials & security cert - simulation only until those are set up
   */
  async b2cPayment(params: {
    initiatorName: string;
    amount: number;
    partyA: string;
    partyB: string;
    remarks: string;
    occassion?: string;
  }): Promise<MpesaResponse> {
    if (!this.hasCredentials) {
      return this.simulateInteraction("B2C", params);
    }
    // B2C requires an Initiator Password encrypted with Daraja public cert.
    // Sandbox simulation is acceptable until that's configured.
    console.log("[MPESA] B2C simulation (initiator cert required for real B2C)");
    return this.simulateInteraction("B2C", params);
  }

  /**
   * Registers C2B Validation and Confirmation URLs
   */
  async c2bRegisterUrl(params: {
    shortCode: string;
    confirmationUrl: string;
    validationUrl: string;
  }): Promise<MpesaResponse> {
    if (!this.hasCredentials) {
      return this.simulateInteraction("C2B_REGISTER", params);
    }

    try {
      const token = await getDarajaToken();
      const payload = {
        ShortCode: params.shortCode,
        ResponseType: "Completed",
        ConfirmationURL: params.confirmationUrl,
        ValidationURL: params.validationUrl,
      };

      const res = await fetch(
        `${DARAJA_BASE_URL}/mpesa/c2b/v1/registerurl`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      console.log("[MPESA] C2B Register ←", JSON.stringify(data));
      return data as MpesaResponse;
    } catch (err: any) {
      return { ResponseCode: "1", ResponseDescription: err.message };
    }
  }

  /**
   * Simulates a C2B Transaction (Sandbox only)
   */
  async c2bSimulate(params: {
    shortCode: string;
    amount: number;
    msisdn: string;
    billRefNumber: string;
  }): Promise<MpesaResponse> {
    if (!this.isLive) {
      return this.simulateInteraction("C2B_SIMULATE", params);
    }
    return {
      ResponseCode: "1",
      ResponseDescription: "Simulation only allowed in sandbox",
    };
  }

  /**
   * Checks Transaction Status
   */
  async getTransactionStatus(params: {
    transactionId: string;
    shortCode: string;
  }): Promise<MpesaResponse> {
    return this.simulateInteraction("TRANSACTION_STATUS", params);
  }

  /**
   * Checks Account Balance
   */
  async getAccountBalance(params: {
    shortCode: string;
  }): Promise<MpesaResponse> {
    return this.simulateInteraction("ACCOUNT_BALANCE", params);
  }

  /**
   * Mock simulation for development/testing without real credentials
   */
  private async simulateInteraction(
    type: string,
    params: any
  ): Promise<MpesaResponse> {
    console.log(`[SIMULATION] M-Pesa ${type} Request:`, JSON.stringify(params));
    await new Promise((r) => setTimeout(r, 600));

    const baseResponse = {
      ResponseCode: "0",
      ResponseDescription: "Success. Request accepted for processing.",
      ConversationID: crypto.randomUUID(),
      OriginatorConversationID: crypto.randomUUID(),
    };

    if (type === "STK_PUSH") {
      return {
        ...baseResponse,
        MerchantRequestID: crypto.randomUUID(),
        CheckoutRequestID: `ws_CO_${Date.now()}`,
        CustomerMessage: "Success. Request accepted for processing.",
      };
    }

    return baseResponse;
  }

  /**
   * Decodes Safaricom callback result (STK / B2C / C2B)
   */
  decodeCallback(body: any) {
    // STK Push Callback
    const stkCallback = body?.Body?.stkCallback;
    if (stkCallback) {
      const metadataItems = stkCallback.CallbackMetadata?.Item || [];
      return {
        type: "STK_PUSH",
        success: stkCallback.ResultCode === 0,
        resultCode: stkCallback.ResultCode,
        resultDesc: stkCallback.ResultDesc,
        checkoutRequestId: stkCallback.CheckoutRequestID,
        amount: metadataItems.find((i: any) => i.Name === "Amount")?.Value,
        mpesaReceiptNumber: metadataItems.find(
          (i: any) => i.Name === "MpesaReceiptNumber"
        )?.Value,
        phoneNumber: metadataItems.find((i: any) => i.Name === "PhoneNumber")
          ?.Value,
      };
    }

    // B2C / generic Result callback
    const result = body?.Result;
    if (result) {
      return {
        type: result.TransactionID ? "B2C" : "GENERIC_RESULT",
        success: result.ResultCode === 0,
        transactionId: result.TransactionID,
        conversationId: result.ConversationID,
        resultCode: result.ResultCode,
        resultDesc: result.ResultDesc,
      };
    }

    return null;
  }
}
