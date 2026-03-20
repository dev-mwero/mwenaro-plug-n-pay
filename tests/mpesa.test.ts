import { describe, it, expect, vi } from "vitest";
import { MpesaService } from "../src/lib/services/mpesa";

describe("M-Pesa Service (Mock)", () => {
  it("should simulate an STK Push successfully", async () => {
    const mpesa = new MpesaService(false);
    const response = await mpesa.stkPush({
      phoneNumber: "254712345678",
      amount: 100,
      accountReference: "TEST",
      transactionDesc: "Test Payment",
      callbackUrl: "http://localhost:3000/api/callback"
    });

    expect(response.ResponseCode).toBe("0");
    expect(response.CheckoutRequestID).toBeDefined();
  });

  it("should decode a valid callback correctly", () => {
    const mpesa = new MpesaService();
    const mockCallback = {
      Body: {
        stkCallback: {
          MerchantRequestID: "123",
          CheckoutRequestID: "checkout-123",
          ResultCode: 0,
          ResultDesc: "The service request is processed successfully.",
          CallbackMetadata: {
            Item: [
              { Name: "Amount", Value: 1.0 },
              { Name: "MpesaReceiptNumber", Value: "NLJ7RT61SV" },
              { Name: "PhoneNumber", Value: 254712345678 }
            ]
          }
        }
      }
    };

    const decoded = mpesa.decodeCallback(mockCallback);
    expect(decoded?.success).toBe(true);
    expect(decoded?.mpesaReceiptNumber).toBe("NLJ7RT61SV");
    expect(decoded?.amount).toBe(1.0);
  });
});
