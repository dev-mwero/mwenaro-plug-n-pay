# 🚀 Mwenaro PlugPay

**Mwenaro PlugPay** is a developer-first SaaS platform bridging the gap between complex mobile money APIs (Safaricom Daraja) and modern developer workflows. Think of it as "Stripe for M-Pesa", offering a unified dashboard, API key management, and robust transaction logging.

---

## ✨ Features
- **Developer-First API**: Unified endpoints for M-Pesa STK Push, B2C, C2B, and Account Balance.
- **Secure Authentication**: Built with NextAuth v5 (Google Auth & OTP).
- **API Key Management**: Generate live and sandbox API keys with secure SHA-256 hashing.
- **Beautiful Dashboard**: Real-time analytical charts built with Recharts & Shadcn UI.
- **Robust Local Logging**: Fast, reliable file-based transaction logging using `@libsql/client` (WASM SQLite) mapped directly to your local file system, eliminating standard native-binding crashes in edge runtimes.

---

## 🛠 Tech Stack
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & [Shadcn UI](https://ui.shadcn.com/)
- **Authentication**: NextAuth v5
- **Database (State)**: MongoDB via Mongoose
- **Database (Logs)**: `libsql` (SQLite for high-velocity transaction caching & backups)

---

## 🔧 Getting Started

### 1. Prerequisites
Ensure you have the following installed:
- Node.js `v20+` (Tested on `v22.x`)
- `pnpm` (Package Manager)
- A local or remote MongoDB instance

### 2. Environment Variables
Copy the `.env.local.example` file and configure your credentials:

```bash
cp .env.local.example .env.local
```

Inside `.env.local`, configure your Auth secrets, MongoDB URI, and Safaricom Daraja Sandbox credentials:

```env
AUTH_SECRET=generate_a_strong_secret
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
MONGODB_URI=mongodb://localhost:27017/mwenaro-pay

# Safaricom Daraja (Sandbox default)
MPESA_CONSUMER_KEY=your_daraja_consumer_key
MPESA_CONSUMER_SECRET=your_daraja_consumer_secret
MPESA_PASS_KEY=your_daraja_passkey
MPESA_SHORT_CODE=174379

# Used for local testing of M-Pesa callbacks
NEXTAUTH_URL=http://localhost:3000
```

### 3. Installation & Run
Install dependencies and spin up the development server:

```bash
pnpm install
pnpm dev --webpack
```

Navigate to `http://localhost:3000` to view the landing page, and `/login` to access the developer dashboard!

---

## 📡 Core API Usage (Sandbox)

To test the raw Daraja API integration locally after generating a Sandbox API Key:

```bash
curl -X POST "http://localhost:3000/api/v1/payments?type=stk" \
  -H "Authorization: Bearer mpl_test_YOUR_GENERATED_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "254708374149",
    "amount": 1,
    "accountReference": "TestPay",
    "transactionDesc": "Testing PlugPay SDK"
  }'
```

_Note: If developing locally, ensure you set a public `NEXTAUTH_URL` (like an Ngrok tunnel) in your `.env.local` so Daraja can successfully POST back webhook results._
