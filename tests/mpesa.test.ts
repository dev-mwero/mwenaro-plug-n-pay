import { describe, it, expect } from "vitest";
import { MpesaService } from "../src/lib/services/mpesa";

describe("M-Pesa Service (Expanded Mock)", () => {
  const mpesa = new MpesaService(false);

  it("should simulate an STK Push successfully", async () => {
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

  it("should simulate a B2C Payout successfully", async () => {
    const response = await mpesa.b2cPayment({
      initiatorName: "TestUser",
      amount: 50.5,
      partyA: "600000",
      partyB: "254711223344",
      remarks: "Test B2C"
    });

    expect(response.ResponseCode).toBe("0");
    expect(response.ConversationID).toBeDefined();
  });

  it("should simulate a C2B Registration successfully", async () => {
    const response = await mpesa.c2bRegisterUrl({
      shortCode: "600000",
      confirmationUrl: "http://test.com/confirm",
      validationUrl: "http://test.com/validate"
    });

    expect(response.ResponseCode).toBe("0");
  });

  it("should decode an STK Callback correctly", () => {
    const mockCallback = {
      Body: {
        stkCallback: {
          MerchantRequestID: "123",
          CheckoutRequestID: "checkout-123",
          ResultCode: 0,
          ResultDesc: "Success",
          CallbackMetadata: {
            Item: [
              { Name: "Amount", Value: 10.0 },
              { Name: "MpesaReceiptNumber", Value: "REC12345" },
              { Name: "PhoneNumber", Value: 254712345678 }
            ]
          }
        }
      }
    };

    const decoded = mpesa.decodeCallback(mockCallback);
    expect(decoded?.type).toBe("STK_PUSH");
    expect(decoded?.success).toBe(true);
    expect(decoded?.mpesaReceiptNumber).toBe("REC12345");
  });

  it("should decode a B2C Result correctly", () => {
    const mockResult = {
      Result: {
        ResultCode: 0,
        ResultDesc: "Success",
        TransactionID: "B2C_ID_123",
        ConversationID: "CONV_123"
      }
    };

    const decoded = mpesa.decodeCallback(mockResult);
    expect(decoded?.type).toBe("B2C");
    expect(decoded?.success).toBe(true);
    expect(decoded?.transactionId).toBe("B2C_ID_123");
  });
});
