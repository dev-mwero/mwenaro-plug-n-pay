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
import { format } from "date-fns";
import { Loader2, RefreshCw, AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorsPage() {
  const [errors, setErrors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchErrors = async () => {
    setLoading(true);
    // Fetch only FAILED transactions
    const data = await getTransactions({ status: "FAILED" });
    setErrors(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchErrors();
  }, []);

  const handleRetry = (transactionId: string) => {
    // In a real app, this would hit an API route to re-queue the transaction webhook
    console.log("Mock Retrying Transaction:", transactionId);
    alert(`Mock Retry triggered for transaction: ${transactionId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 text-premium">Errors & Retries</h1>
          <p className="text-gray-500">Manage and retry failed webhook deliveries or rejected payments.</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchErrors} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          Refresh
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-red-50/30">
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Phone / Ref</TableHead>
                <TableHead>Error Details</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-red-200" />
                  </TableCell>
                </TableRow>
              ) : errors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-gray-400">
                    <AlertTriangle className="h-8 w-8 mx-auto text-gray-200 mb-2" />
                    No errors found! You're all caught up.
                  </TableCell>
                </TableRow>
              ) : (
                errors.map((err) => (
                  <TableRow key={err.transactionId} className="hover:bg-red-50/10">
                    <TableCell className="text-xs font-mono text-gray-500">
                      {format(new Date(err.createdAt), "MMM d, HH:mm:ss")}
                    </TableCell>
                    <TableCell>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700">
                        {err.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{err.phoneNumber || "N/A"}</span>
                        <span className="text-[10px] text-gray-400 tracking-tighter">
                          {err.transactionId.slice(0, 8)}...
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-red-600 font-medium max-w-[200px] truncate">
                        {err.errorMessage || "Unknown Daraja Error"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 text-xs"
                        onClick={() => handleRetry(err.transactionId)}
                      >
                        <RotateCw className="h-3 w-3 mr-1" />
                        Retry
                      </Button>
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
