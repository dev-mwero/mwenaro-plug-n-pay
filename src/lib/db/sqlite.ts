import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'data/logs.db');

// Ensure the data directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let db: Database.Database;

export function getSqliteDb() {
  if (!db) {
    db = new Database(DB_PATH);
    
    // Initialize the logs table if it doesn't exist
    db.exec(`
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
      );
      
      CREATE INDEX IF NOT EXISTS idx_userId ON transaction_logs(userId);
      CREATE INDEX IF NOT EXISTS idx_createdAt ON transaction_logs(createdAt);
    `);
  }
  return db;
}

export function logTransaction(data: {
  id: string;
  userId: string;
  apiKeyId: string;
  type: string;
  status: string;
  amount: number;
  phoneNumber?: string;
  mpesaReceiptNumber?: string;
  errorMessage?: string;
  rawPayload?: string;
}) {
  const sqlite = getSqliteDb();
  const stmt = sqlite.prepare(`
    INSERT INTO transaction_logs (
      id, userId, apiKeyId, type, status, amount, phoneNumber, mpesaReceiptNumber, errorMessage, rawPayload
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  return stmt.run(
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
  );
}
