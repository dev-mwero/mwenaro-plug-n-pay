"use server";

import { getSqliteDb } from "@/lib/db/sqlite";
import { auth } from "@/auth";

export async function getTransactionLogs(limit: number = 50, offset: number = 0) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const db = getSqliteDb();
  
  const logs = db.prepare(`
    SELECT * FROM transaction_logs 
    WHERE userId = ? 
    ORDER BY createdAt DESC 
    LIMIT ? OFFSET ?
  `).all(session.user?.id, limit, offset);

  const total = db.prepare(`
    SELECT COUNT(*) as count FROM transaction_logs WHERE userId = ?
  `).get(session.user?.id) as { count: number };

  return { logs, total: total.count };
}

export async function getDashboardStats() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const db = getSqliteDb();
  
  const stats = db.prepare(`
    SELECT 
      SUM(CASE WHEN status = 'SUCCESS' THEN amount ELSE 0 END) as totalVolume,
      COUNT(*) as totalTransactions,
      SUM(CASE WHEN status = 'SUCCESS' THEN 1 ELSE 0 END) as successCount,
      SUM(CASE WHEN status = 'FAILED' THEN 1 ELSE 0 END) as failureCount
    FROM transaction_logs 
    WHERE userId = ?
  `).get(session.user?.id) as any;

  // Get daily volume for the last 7 days
  const dailyVolume = db.prepare(`
    SELECT 
      strftime('%Y-%m-%d', createdAt) as date,
      SUM(amount) as volume
    FROM transaction_logs 
    WHERE userId = ? AND createdAt >= date('now', '-7 days')
    GROUP BY date
    ORDER BY date ASC
  `).all(session.user?.id) as any[];

  return { ...stats, dailyVolume };
}
