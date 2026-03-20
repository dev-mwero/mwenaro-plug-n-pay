import crypto from "crypto";

export type MpesaTransactionType = "STK_PUSH" | "B2C" | "C2B";

export interface MpesaResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: "0" | string;
  ResponseDescription: string;
  CustomerMessage?: string;
}

/**
 * Service to handle communication with Safaricom Daraja API
 * or a mock simulation if credentials are missing.
 */
export class MpesaService {
  private isLive: boolean;

  constructor(isLive: boolean = false) {
    this.isLive = isLive;
  }

  /**
   * Initiates an STK Push (Lipa na M-Pesa Online)
   */
  async stkPush(params: {
    phoneNumber: string;
    amount: number;
    accountReference: string;
    transactionDesc: string;
    callbackUrl: string;
  }): Promise<MpesaResponse> {
    
    if (!this.isLive && (!process.env.MPESA_CONSUMER_KEY || !process.env.MPESA_CONSUMER_SECRET)) {
      return this.simulateStkPush(params);
    }

    // TODO: Real Daraja API implementation with OAuth and post request
    console.log("[MPESA] Attempting real STK Push (Not implemented)");
    return this.simulateStkPush(params);
  }

  /**
   * Mock simulation for testing purposes
   */
  private async simulateStkPush(params: {
    phoneNumber: string;
    amount: number;
    accountReference: string;
  }): Promise<MpesaResponse> {
    console.log(`[SIMULATION] STK Push for ${params.phoneNumber} - Amount ${params.amount}`);
    
    // Artificial delay
    await new Promise(r => setTimeout(r, 1000));

    return {
      MerchantRequestID: crypto.randomUUID(),
      CheckoutRequestID: crypto.randomUUID(),
      ResponseCode: "0",
      ResponseDescription: "Success. Request accepted for processing.",
      CustomerMessage: "Success. Request accepted for processing."
    };
  }

  /**
   * Decodes Safaricom callback result
   */
  decodeCallback(body: any) {
    const stkCallback = body?.Body?.stkCallback;
    if (!stkCallback) return null;

    const resultCode = stkCallback.ResultCode;
    const resultDesc = stkCallback.ResultDesc;
    const checkoutRequestId = stkCallback.CheckoutRequestID;
    
    // Extract metadata
    const metadataItems = stkCallback.CallbackMetadata?.Item || [];
    const amount = metadataItems.find((i: any) => i.Name === "Amount")?.Value;
    const mpesaReceiptNumber = metadataItems.find((i: any) => i.Name === "MpesaReceiptNumber")?.Value;
    const phoneNumber = metadataItems.find((i: any) => i.Name === "PhoneNumber")?.Value;

    return {
      success: resultCode === 0,
      resultCode,
      resultDesc,
      checkoutRequestId,
      amount,
      mpesaReceiptNumber,
      phoneNumber,
    };
  }
}
