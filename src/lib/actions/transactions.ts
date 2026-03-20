"use server";

import { getSqliteDb } from "@/lib/db/sqlite";
import { auth } from "@/auth";

export async function getTransactionLogs(limit: number = 50, offset: number = 0) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const db = await getSqliteDb();
  
  const result = await db.execute({
    sql: `
      SELECT * FROM transaction_logs 
      WHERE userId = ? 
      ORDER BY createdAt DESC 
      LIMIT ? OFFSET ?
    `,
    args: [session.user!.id!, limit, offset]
  });

  const totalResult = await db.execute({
    sql: `SELECT COUNT(*) as count FROM transaction_logs WHERE userId = ?`,
    args: [session.user!.id!]
  });

  return { logs: result.rows, total: totalResult.rows[0].count };
}

export async function getDashboardStats() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const db = await getSqliteDb();
  
  const statsResult = await db.execute({
    sql: `
      SELECT 
        SUM(CASE WHEN status = 'SUCCESS' THEN amount ELSE 0 END) as totalVolume,
        COUNT(*) as totalTransactions,
        SUM(CASE WHEN status = 'SUCCESS' THEN 1 ELSE 0 END) as successCount,
        SUM(CASE WHEN status = 'FAILED' THEN 1 ELSE 0 END) as failureCount
      FROM transaction_logs 
      WHERE userId = ?
    `,
    args: [session.user!.id!]
  });

  // Get daily volume for the last 7 days
  const dailyResult = await db.execute({
    sql: `
      SELECT 
        strftime('%Y-%m-%d', createdAt) as date,
        SUM(amount) as volume
      FROM transaction_logs 
      WHERE userId = ? AND createdAt >= date('now', '-7 days')
      GROUP BY date
      ORDER BY date ASC
    `,
    args: [session.user!.id!]
  });

  return { ...statsResult.rows[0], dailyVolume: dailyResult.rows };
}
