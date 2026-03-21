# Implementation Plan: Mwenaro PlugPay (Stripe for M-Pesa)

## Goal Description
Build a developer-first SaaS for M-Pesa payments (C2B, B2C, C2C) with a unified API and a clean, responsive dashboard. The solution will bridge the gap between complex mobile money APIs and modern developer workflows.

## User Review Required (The "Quiz")
> [!IMPORTANT]
> **1. OTP Implementation**: Should the OTP login be via **Email** (easier for initial dev) or **SMS** (more standard for Kenyan fintech)? If SMS, do you have a preferred provider (e.g., Africa's Talking)?
> 
> **2. SQLite vs MongoDB for Logs**: The PRP suggests SQLite for logs alongside MongoDB. Is the intention to use SQLite for edge performance or local persistence during development? I will assume SQLite handles high-velocity transaction logs while MongoDB manages core business state.
> 
> **3. M-Pesa Credentials**: Do you have active Safaricom Daraja API credentials, or should I implement a **"Mwenaro Sandbox"** environment that simulates M-Pesa responses for now?
> 
> **4. Styling & Components**: You mentioned Shadcn UI. Should we use the default "Slate/Zinc" palette or something more "Fintech" (e.g., Emerald/Green for Safaricom vibes or Indigo for a Stripe look)?

## Proposed Changes

---

### Phase 1: Foundation & Data Layer
- **[NEW] [mongodb.ts](file:///home/mwero/saas/mwenaro-pay/src/lib/db/mongodb.ts)**: Shared Mongoose connection logic.
- **[NEW] [sqlite.ts](file:///home/mwero/saas/mwenaro-pay/src/lib/db/sqlite.ts)**: SQLite instance for transaction logging.
- **[NEW] [models/](file:///home/mwero/saas/mwenaro-pay/src/models/)**:
    - `User.ts`: Profiles and subscription state.
    - `ApiKey.ts`: Hashed keys with metadata (sandbox/live).
    - `PaymentConfig.ts`: Paybill/Till/Shortcode details per user.
    - `Transaction.ts`: Summary metadata for Mongo (detailed logs go to SQLite).

---

### Phase 2: Authentication & Security
- **[NEW] [auth.ts](file:///home/mwero/saas/mwenaro-pay/src/auth.ts)**: NextAuth configuration using the new Next.js 16/NextAuth v5 patterns (Middleware-first).
- **[NEW] [login/page.tsx](file:///home/mwero/saas/mwenaro-pay/src/app/(auth)/login/page.tsx)**: Beautiful landing/login page with Google and OTP steps.

---

### Phase 3: Developer API System
- **[NEW] [v1/payments/route.ts](file:///home/mwero/saas/mwenaro-pay/src/app/api/v1/payments/route.ts)**: Main entry point for `STK Push`, `B2C`, etc.
- **[NEW] [mpesa-service.ts](file:///home/mwero/saas/mwenaro-pay/src/lib/services/mpesa-service.ts)**: Core service to communicate with Safaricom Daraja API.
- **[NEW] [v1/webhooks/route.ts](file:///home/mwero/saas/mwenaro-pay/src/app/api/v1/webhooks/route.ts)**: Endpoint for M-Pesa to POST transaction results.

---

### Phase 4: Dashboard & Analytics
- **[MODIFY] [page.tsx](file:///home/mwero/saas/mwenaro-pay/src/app/page.tsx)**: Transform to a high-conversion landing page.
- **[NEW] [dashboard/](file:///home/mwero/saas/mwenaro-pay/src/app/(dashboard)/dashboard/)**:
    - `overview/`: Charts (Recharts) showing transaction volume/success rates.
    - `developers/`: API Key generation and management.
    - `logs/`: Real-time transaction feed reading from SQLite.
    - `settings/`: Configuration management for payment methods.

---

### Phase 5: Documentation
- **[NEW] [src/app/docs/page.tsx](file:///home/mwero/saas/mwenaro-pay/src/app/docs/page.tsx)**: Detailed developer documentation covering.
  - Authentication headers.
  - Integration examples for Javascript, Typescript, Node.js (Fetch/Axios), and CURL.
  - Request/Response payloads for STK Push, B2C, C2B, and C2C.
  - Webhook payload structure.

---

## Verification Plan

### Automated Tests
- **Database Connection Test**: Script to verify MongoDB and SQLite are writable.
- **API Secret Verification**: Unit test for API key hashing and validation logic.
- **M-Pesa Payload Simulation**: Integration test suite to verify webhook handling with mock Daraja payloads.

### Manual Verification
1. **Developer Experience**:
    - Signup -> Create Sandbox Key -> `curl` a payment request -> Verify success.
2. **Dashboard Fidelity**:
    - Check if "Live Mode" toggle updates the UI correctly across components.
    - Verify charts populate after a batch of mock transactions.
