"use client";

import { useEffect, useState } from "react";
import { getReconciliationStats, getTransactions } from "@/lib/actions/mongo-transactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, RefreshCcw, CheckCircle2, AlertCircle, Clock } from "lucide-react";

export default function ReconciliationPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    try {
      const dbStats = await getReconciliationStats();
      setStats(dbStats);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reconciliation</h1>
          <p className="text-gray-500">Monitor your transaction statuses and settle discrepancies.</p>
        </div>
        <button 
          onClick={loadData}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition"
        >
          <RefreshCcw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
              Settled / Success
            </CardTitle>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              KES {stats?.SUCCESS?.totalAmount?.toLocaleString() || "0"}
            </div>
            <p className="text-sm text-gray-500 mt-1">{stats?.SUCCESS?.count || 0} Transactions</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-amber-600">
              Pending
            </CardTitle>
            <Clock className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              KES {stats?.PENDING?.totalAmount?.toLocaleString() || "0"}
            </div>
            <p className="text-sm text-gray-500 mt-1">{stats?.PENDING?.count || 0} Transactions</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-red-600">
              Failed / Disputed
            </CardTitle>
            <AlertCircle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              KES {stats?.FAILED?.totalAmount?.toLocaleString() || "0"}
            </div>
            <p className="text-sm text-gray-500 mt-1">{stats?.FAILED?.count || 0} Transactions</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Optional: Add a placeholder list of issues needing attention */}
      {(stats?.FAILED?.count > 0 || stats?.PENDING?.count > 0) && (
        <Card className="border-none bg-indigo-50/50">
           <CardContent className="p-6">
               <h3 className="font-semibold text-indigo-900 mb-2">Attention Required</h3>
               <p className="text-sm text-indigo-700">
                  You have <b>{stats?.FAILED?.count} failed</b> and <b>{stats?.PENDING?.count} pending</b> transactions that may need manual reconciliation. Check the Errors tab for more details.
               </p>
           </CardContent>
        </Card>
      )}
    </div>
  );
}
