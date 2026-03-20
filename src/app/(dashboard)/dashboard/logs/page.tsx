"use client";

import { useEffect, useState } from "react";
import { getTransactionLogs } from "@/lib/actions/transactions";
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
import { Loader2, RefreshCw, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    const data = await getTransactionLogs();
    setLogs(data.logs);
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
                  <TableRow key={log.id} className="hover:bg-gray-50/50">
                    <TableCell className="text-xs font-mono text-gray-400">
                      {format(new Date(log.createdAt), "MMM d, HH:mm:ss")}
                    </TableCell>
                    <TableCell>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                        {log.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{log.phoneNumber || "N/A"}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-tighter">API: {log.apiKeyId.slice(-6)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-gray-700">
                      KES {log.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                        log.status === "SUCCESS" ? "bg-emerald-100 text-emerald-700" : 
                        log.status === "FAILED" ? "bg-red-100 text-red-700" : 
                        "bg-amber-100 text-amber-700 animate-pulse"
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
