"use server";

import dbConnect from "@/lib/db/mongodb";
import Transaction from "@/models/Transaction";
import { auth } from "@/auth";

export async function getTransactions(filters: { status?: string, limit?: number } = {}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    await dbConnect();

    const query: any = { userId: session.user.id };
    if (filters.status) {
      query.status = filters.status;
    }

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(filters.limit || 100)
      .lean();

    // Serialize to standard JS object
    return JSON.parse(JSON.stringify(transactions));
  } catch (error) {
    console.error("Failed to fetch mongo transactions:", error);
    return [];
  }
}

export async function getReconciliationStats() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    await dbConnect();

    const stats = await Transaction.aggregate([
      // Note: we might need to cast to ObjectId if userId is string
      { $match: { userId: session.user.id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);

    const result = {
      SUCCESS: { count: 0, totalAmount: 0 },
      PENDING: { count: 0, totalAmount: 0 },
      FAILED: { count: 0, totalAmount: 0 },
    };

    stats.forEach(stat => {
      if (result[stat._id as keyof typeof result]) {
        result[stat._id as keyof typeof result] = {
          count: stat.count,
          totalAmount: stat.totalAmount
        };
      }
    });

    return result;
  } catch (error) {
    console.error("Failed to fetch mongo stats:", error);
    return {
      SUCCESS: { count: 0, totalAmount: 0 },
      PENDING: { count: 0, totalAmount: 0 },
      FAILED: { count: 0, totalAmount: 0 },
    };
  }
}
