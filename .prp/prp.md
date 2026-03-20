PRP for “Stripe for M-Pesa” SaaS called Mwenaro PlugPay

Product Name / Working Title:
PlugPay (or your preferred working title)

One-Sentence Idea:
A developer-first, plug-and-play SaaS web app for M-Pesa payments (C2B, B2C, C2C) with a dashboard and API that makes mobile money integration seamless.

Target Audience:

Primary: Developers who want a unified M-Pesa API and dashboard.

Secondary: Businesses needing a simple dashboard for sending/receiving money.

User Journey / Flow:

Land on site (appealing landing page)

Create account via Google Auth + OTP login

Select payment method (Paybill / Till / Mobile)

Generate API key (sandbox or live)

Test payments

Go live with transactions

Monitor dashboard for real-time analytics and transaction logs

Core Features:

Developers (Primary Users)

API Key Management (sandbox + live)

Payments API (C2B, B2C, C2C)

Webhooks / Callback Handling

Sandbox vs Live Mode

Dashboard / Business Layer

Transaction Logs

Payments Overview (analytics)

Reconciliation View

Payment Method Configuration

Data Models:

Users

API Keys

Transactions

Payment Configs (Paybill/Till/etc.)

Webhook Logs

Errors / Retries

Platform / Stack:

Web app + API

Next.js 16 + TypeScript

MongoDB (Mongoose) + SQLite for transaction logs

ShadCN UI + animation libraries

Real-time updates (WebSockets / subscriptions)

Authentication & Security:

Google Auth + OTP login via NextAuth

Vibe / Design Notes:

Landing page: rich, appealing, marketing-focused

Dashboard: minimal, clean, developer-focused, dashboard-heavy with charts & analytics

Future Features:

Multi-team accounts / organizations

More payment providers beyond M-Pesa

Subscriptions / recurring billing

Advanced analytics / reporting

Mobile app
