"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Smartphone, Building2, UserCircle, Loader2 } from "lucide-react";

export default function SimulatorPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const simulate = async (type: string, data: any) => {
    setLoading(true);
    setResult(null);
    try {
      // In a real app, this would use a dedicated internal API or the public API with a test key
      const res = await fetch(`/api/v1/payments?type=${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // We assume the user is authenticated and we can bypass public key check for internal simulator
          // or we just use a placeholder for now
          "Authorization": "Bearer mpl_test_simulator_key" 
        },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      setResult(json);
    } catch (e) {
      setResult({ error: "Simulation failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-premium">API Simulator</h1>
        <p className="text-gray-500">Test your M-Pesa integrations instantly in sandbox mode.</p>
      </div>

      <Tabs defaultValue="stk" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="stk" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" /> STK Push
          </TabsTrigger>
          <TabsTrigger value="b2c" className="flex items-center gap-2">
            <UserCircle className="h-4 w-4" /> B2C Payout
          </TabsTrigger>
          <TabsTrigger value="c2b" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" /> C2B Simulation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stk">
          <Card>
            <CardHeader>
              <CardTitle>Lipa na M-Pesa Online</CardTitle>
              <CardDescription>Initiate a payment request to a customer's phone.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                simulate("stk", {
                  phoneNumber: fd.get("phone"),
                  amount: fd.get("amount"),
                  accountReference: "SIMULATOR",
                  transactionDesc: "Test STK"
                });
              }}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input name="phone" placeholder="2547XXXXXXXX" defaultValue="254712345678" />
                  </div>
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <Input name="amount" type="number" defaultValue="1" />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Trigger STK Push
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="b2c">
          <Card>
            <CardHeader>
              <CardTitle>Business to Customer</CardTitle>
              <CardDescription>Send funds from your shortcode to a customer.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                simulate("b2c", {
                  b2cReceiver: fd.get("phone"),
                  b2cAmount: fd.get("amount"),
                  b2cRemarks: "Simulator Test"
                });
              }}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Recipient Phone</Label>
                    <Input name="phone" placeholder="2547XXXXXXXX" defaultValue="254711223344" />
                  </div>
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <Input name="amount" type="number" defaultValue="50" />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Trigger B2C Payout
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="c2b">
          <Card>
            <CardHeader>
              <CardTitle>C2B Simulation</CardTitle>
              <CardDescription>Simulate a customer paying to your shortcode.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                simulate("c2b-register", {
                  shortCode: "600000",
                });
              }}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Shortcode</Label>
                    <Input name="shortcode" defaultValue="600000" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <Input name="amount" type="number" defaultValue="10" />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={loading}>
                   {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Trigger C2B Sim
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {result && (
        <Card className="border-emerald-100 bg-emerald-50/10">
          <CardHeader>
            <CardTitle className="text-sm border-b pb-2">Response Payload</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs font-mono p-4 bg-gray-900 text-emerald-400 rounded-lg overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
