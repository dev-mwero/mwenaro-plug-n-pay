# 🚀 Mwenaro PlugPay

Mwenaro PlugPay is a developer-focused M-Pesa integration platform built with Next.js.

It provides:
- API-key based payment APIs (`STK`, `B2C`, `C2C`, `C2B register`)
- Dashboard for keys, logs, and reconciliation
- NextAuth authentication (Google + OTP)
- Dual persistence: MongoDB (primary state) + SQLite/libsql (fast transaction logs)

## ✨ Core features

- **Unified payment endpoint** at `/api/v1/payments?type=...`
- **API key management** with hashed keys and one-time raw key reveal
- **Asynchronous callback handling** for STK results
- **Dashboard analytics** and transaction overview
- **Sandbox simulation fallback** when M-Pesa credentials are missing

## 🧱 Tech stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- NextAuth v5 beta
- MongoDB + Mongoose
- libsql (`@libsql/client`) for local transaction log storage
- Tailwind CSS + shadcn/ui
- Vitest for tests

## ✅ Prerequisites

- Node.js 20+
- `pnpm`
- MongoDB instance (local or remote)

## ⚙️ Environment variables

Create a `.env.local` in the project root and add the following:

```env
# NextAuth
AUTH_SECRET=replace_with_a_strong_secret
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/mwenaro-pay

# Safaricom Daraja (sandbox)
MPESA_CONSUMER_KEY=your_daraja_consumer_key
MPESA_CONSUMER_SECRET=your_daraja_consumer_secret
MPESA_PASS_KEY=your_daraja_pass_key
MPESA_SHORT_CODE=174379

# Optional SMTP (OTP emails)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_user
SMTP_PASS=your_password
SMTP_FROM="Mwenaro PlugPay <no-reply@example.com>"
```

Notes:
- If SMTP is not configured, OTPs are logged to the server console.
- In development, there is a test bypass for `test@example.com` with OTP `123456`.

## 🏁 Local development

```bash
pnpm install
pnpm dev
```

App URLs:
- Landing: `http://localhost:3000`
- Login: `http://localhost:3000/login`
- Docs page: `http://localhost:3000/docs`

## 📜 Available scripts

```bash
pnpm dev      # Run development server
pnpm build    # Production build
pnpm start    # Run production server
pnpm lint     # Biome checks
pnpm format   # Format with Biome
pnpm test     # Run Vitest
```

## 🔐 Authentication model

- Dashboard APIs use authenticated session (`NextAuth`).
- Public payment APIs require `Authorization: Bearer <api_key>`.
- Sandbox simulator supports internal dashboard key `mpl_test_simulator_key` for signed-in users.

## 📡 API quickstart

### 1) Create an API key

From the dashboard: **Dashboard → Keys**.

### 2) Trigger STK push

```bash
curl -X POST "http://localhost:3000/api/v1/payments?type=stk" \
  -H "Authorization: Bearer mpl_test_YOUR_GENERATED_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "254712345678",
    "amount": 1,
    "accountReference": "INV-1001",
    "transactionDesc": "Test payment"
  }'
```

### 3) Other payment types

- `type=b2c`
  - body: `b2cAmount`, `b2cReceiver`, optional `b2cRemarks`
- `type=c2c`
  - body: `senderPhone`, `receiverPhone`, `c2cAmount`, optional `c2cRemarks`
- `type=c2b-register`
  - body: `shortCode`

## 🔔 Callbacks

STK callbacks are handled at:

- `/api/v1/callbacks/stk`

For local callback testing with real Daraja callbacks, expose your app publicly and set `NEXTAUTH_URL` accordingly.

## 🧪 Tests

```bash
pnpm test
```

Current tests cover:
- API key generation + validation
- M-Pesa service simulation + callback decoding

## 📁 Project layout (high level)

- `src/app` – routes, pages, API handlers
- `src/components` – UI and dashboard components
- `src/lib` – business logic, DB clients, actions, services
- `src/models` – Mongoose models
- `tests` – Vitest suites

---

If you want, I can also add a `.env.local.example` file to match this README.
