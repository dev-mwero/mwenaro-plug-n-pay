import { createClient, Client } from "@libsql/client";
import path from "path";
import fs from "fs";

const isServerless = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
const DB_PATH = isServerless
  ? path.join("/tmp", "logs.db")
  : path.join(process.cwd(), "data/logs.db");

// Ensure the data directory exists only if we aren't in a serverless /tmp folder
const dbDir = path.dirname(DB_PATH);
if (!isServerless && !fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let db: Client | null = null;
let isInitialized = false;

export async function getSqliteDb(): Promise<Client> {
  if (!db) {
    db = createClient({
      url: `file:${DB_PATH}`,
    });
  }

  if (!isInitialized) {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS transaction_logs (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        apiKeyId TEXT NOT NULL,
        type TEXT NOT NULL, -- C2B, B2C, C2C
        status TEXT NOT NULL, -- PENDING, SUCCESS, FAILED
        amount REAL NOT NULL,
        currency TEXT DEFAULT 'KES',
        phoneNumber TEXT,
        mpesaReceiptNumber TEXT,
        errorMessage TEXT,
        rawPayload TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_userId ON transaction_logs(userId)`);
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_createdAt ON transaction_logs(createdAt)`);
    isInitialized = true;
  }
  return db;
}

export async function logTransaction(data: {
  id: string;
  userId: string;
  apiKeyId: string;
  type: string;
  status: string;
  amount: number;
  phoneNumber?: string;
  mpesaReceiptNumber?: string;
  errorMessage?: string;
  rawPayload?: any;
}) {
  try {
    const sqlite = await getSqliteDb();
    return await sqlite.execute({
      sql: `INSERT INTO transaction_logs (
        id, userId, apiKeyId, type, status, amount, phoneNumber, mpesaReceiptNumber, errorMessage, rawPayload
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        data.id,
        data.userId,
        data.apiKeyId,
        data.type,
        data.status,
        data.amount,
        data.phoneNumber || null,
        data.mpesaReceiptNumber || null,
        data.errorMessage || null,
        data.rawPayload ? JSON.stringify(data.rawPayload) : null
      ]
    });
  } catch (error) {
    console.error("[SQLITE] Failed to log transaction. It may be logged only in MongoDB.", error);
    return null;
  }
}
