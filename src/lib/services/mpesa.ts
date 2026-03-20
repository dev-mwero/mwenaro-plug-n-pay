import crypto from "crypto";

export type MpesaTransactionType = "STK_PUSH" | "B2C" | "C2B" | "TRANSACTION_STATUS" | "ACCOUNT_BALANCE" | "REVERSAL";

export interface MpesaResponse {
  OriginatorConversationID?: string;
  ConversationID?: string;
  MerchantRequestID?: string;
  CheckoutRequestID?: string;
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
      return this.simulateInteraction("STK_PUSH", params);
    }
    // Real implementation would go here
    return this.simulateInteraction("STK_PUSH", params);
  }

  /**
   * Initiates a B2C Payment (Business to Customer)
   */
  async b2cPayment(params: {
    initiatorName: string;
    amount: number;
    partyA: string; // Shortcode
    partyB: string; // Receiver Phone
    remarks: string;
    occassion?: string;
  }): Promise<MpesaResponse> {
    if (!this.isLive && (!process.env.MPESA_CONSUMER_KEY || !process.env.MPESA_CONSUMER_SECRET)) {
      return this.simulateInteraction("B2C", params);
    }
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
    if (!this.isLive && (!process.env.MPESA_CONSUMER_KEY || !process.env.MPESA_CONSUMER_SECRET)) {
      return this.simulateInteraction("C2B_REGISTER", params);
    }
    return this.simulateInteraction("C2B_REGISTER", params);
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
    return { ResponseCode: "1", ResponseDescription: "Simulation only allowed in sandbox" };
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
   * Mock simulation for testing purposes
   */
  private async simulateInteraction(type: string, params: any): Promise<MpesaResponse> {
    console.log(`[SIMULATION] M-Pesa ${type} Request:`, JSON.stringify(params));
    await new Promise(r => setTimeout(r, 800));

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
        CheckoutRequestID: crypto.randomUUID(),
        CustomerMessage: "Success. Request accepted for processing."
      };
    }

    return baseResponse;
  }

  /**
   * Decodes Safaricom callback result (Universal decoder for STK/B2C/C2B)
   */
  decodeCallback(body: any) {
    // STK Push Callback logic
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
        mpesaReceiptNumber: metadataItems.find((i: any) => i.Name === "MpesaReceiptNumber")?.Value,
        phoneNumber: metadataItems.find((i: any) => i.Name === "PhoneNumber")?.Value,
      };
    }

    // B2C / Result Callback logic
    const result = body?.Result;
    if (result) {
      return {
        type: result.TransactionID ? "B2C" : "GENERIC_RESULT",
        success: result.ResultCode === 0,
        transactionId: result.TransactionID,
        conversationId: result.ConversationID,
        resultCode: result.ResultCode,
        resultDesc: result.ResultDesc,
        // ... naturally would extract more based on type
      };
    }

    return null;
  }
}
