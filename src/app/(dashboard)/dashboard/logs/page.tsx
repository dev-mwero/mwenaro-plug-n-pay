"use client";

import { useEffect, useState } from "react";
import { getTransactions } from "@/lib/actions/mongo-transactions";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    const data = await getTransactions();
    setLogs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 text-premium">Transaction Logs</h1>
          <p className="text-gray-500">Real-time history of all M-Pesa interactions.</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchLogs} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          Refresh
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Phone / Reference</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-emerald-200" />
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-gray-400">
                    No transactions found yet.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.transactionId} className="hover:bg-gray-50/50">
                    <TableCell className="text-xs font-mono text-gray-400">
                      {format(new Date(log.createdAt), "MMM d, HH:mm:ss")}
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded",
                        log.type === "STK_PUSH" ? "bg-blue-100 text-blue-700" :
                        log.type === "B2C" ? "bg-purple-100 text-purple-700" :
                        log.type === "C2B" ? "bg-orange-100 text-orange-700" :
                        "bg-gray-100 text-gray-600"
                      )}>
                        {log.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{log.phoneNumber || "N/A"}</span>
                        <span className="text-[10px] text-gray-400 tracking-tighter">
                          {log.transactionId.slice(0, 8)}...
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-gray-700">
                      KES {log.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                        log.status === "SUCCESS" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : 
                        log.status === "FAILED" ? "bg-red-50 text-red-700 border-red-100" : 
                        "bg-amber-50 text-amber-700 border-amber-100 animate-pulse"
                      )}>
                        {log.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs text-gray-500">
                      {log.mpesaReceiptNumber || "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
