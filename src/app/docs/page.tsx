import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, BookOpen, Key, Webhook, Terminal } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto p-6 lg:p-12 space-y-12">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-xl mb-4">
            <BookOpen className="h-8 w-8 text-indigo-700" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Mwenaro PlugPay API</h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            Integrate M-Pesa into your application in minutes. The easiest way to accept, disburse, and manage mobile money.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Navigation Sidebar */}
          <div className="hidden lg:block space-y-6">
            <div className="sticky top-12">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">Getting Started</h3>
              <ul className="space-y-3 text-sm font-medium text-gray-600">
                <li><a href="#authentication" className="hover:text-indigo-600 transition">Authentication</a></li>
                <li><a href="#endpoints" className="hover:text-indigo-600 transition">Core Endpoints</a></li>
                <li><a href="#webhooks" className="hover:text-indigo-600 transition">Webhooks</a></li>
              </ul>
              
              <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mt-8 mb-4">Integrations</h3>
              <ul className="space-y-3 text-sm font-medium text-gray-600">
                <li><a href="#stk-push" className="hover:text-indigo-600 transition">STK Push (Lipa na M-Pesa)</a></li>
                <li><a href="#b2c" className="hover:text-indigo-600 transition">B2C (Disbursements)</a></li>
                <li><a href="#c2b" className="hover:text-indigo-600 transition">C2B (Paybill/Till)</a></li>
                <li><a href="#c2c" className="hover:text-indigo-600 transition">C2C (Send Money)</a></li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-16">
            
            {/* Authentication */}
            <section id="authentication" className="scroll-mt-12">
              <div className="flex items-center gap-3 mb-6">
                <Key className="h-6 w-6 text-indigo-600" />
                <h2 className="text-2xl font-bold">Authentication</h2>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                All requests to the Mwenaro API must encompass a valid API key in the Authorization header. 
                You can generate Sandbox or Live keys directly from your developer dashboard.
              </p>
              
              <Card className="bg-slate-950 border-none shadow-xl">
                <CardHeader className="border-b border-slate-800 bg-slate-900/50">
                  <CardTitle className="text-sm font-mono text-slate-300">Request Headers</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <pre className="text-sm text-emerald-400 font-mono overflow-x-auto">
                    <code>
Authorization: Bearer mpl_test_YOUR_API_KEY{`\n`}
Content-Type: application/json
                    </code>
                  </pre>
                </CardContent>
              </Card>
            </section>

            {/* Endpoints & Core Implementations */}
            <section id="stk-push" className="scroll-mt-12">
              <div className="flex items-center gap-3 mb-6">
                <Terminal className="h-6 w-6 text-indigo-600" />
                <h2 className="text-2xl font-bold">STK Push (Lipa na M-Pesa)</h2>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Trigger a prompt on the customer's phone to enter their M-Pesa PIN and complete a payment.
              </p>

              <Tabs defaultValue="curl" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none mb-6 bg-transparent h-12 p-0 space-x-6">
                  <TabsTrigger value="curl" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none bg-transparent shadow-none px-0 tracking-wide font-medium">cURL</TabsTrigger>
                  <TabsTrigger value="node" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none bg-transparent shadow-none px-0 tracking-wide font-medium">Node.js (Axios)</TabsTrigger>
                  <TabsTrigger value="ts" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none bg-transparent shadow-none px-0 tracking-wide font-medium">TypeScript (Fetch)</TabsTrigger>
                </TabsList>
                
                <TabsContent value="curl">
                  <Card className="bg-slate-950 border-none shadow-xl">
                    <CardContent className="p-6">
                      <pre className="text-sm text-blue-400 font-mono overflow-x-auto">
                        <code>
{`curl -X POST "https://plugnpay.mwenaro.com/api/v1/payments?type=stk" \\
  -H "Authorization: Bearer mpl_test_YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phoneNumber": "254712345678",
    "amount": 1050,
    "accountReference": "INV-2026",
    "transactionDesc": "Premium Subscription"
  }'`}
                        </code>
                      </pre>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="node">
                  <Card className="bg-slate-950 border-none shadow-xl">
                    <CardContent className="p-6">
                      <pre className="text-sm text-yellow-300 font-mono overflow-x-auto">
                        <code>
{`const axios = require('axios');

async function initiateSTK() {
  try {
    const response = await axios.post('https://plugnpay.mwenaro.com/api/v1/payments?type=stk', {
      phoneNumber: "254712345678",
      amount: 1050,
      accountReference: "INV-2026",
      transactionDesc: "Premium Subscription"
    }, {
      headers: {
        'Authorization': 'Bearer mpl_test_YOUR_API_KEY',
        'Content-Type': 'application/json'
      }
    });
    
    console.log(response.data.transactionId);
  } catch (error) {
    console.error(error.response.data);
  }
}`}
                        </code>
                      </pre>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="ts">
                  <Card className="bg-slate-950 border-none shadow-xl">
                    <CardContent className="p-6">
                      <pre className="text-sm text-blue-300 font-mono overflow-x-auto">
                        <code>{`interface StkPayload {
  phoneNumber: string;
  amount: number;
  accountReference: string;
  transactionDesc?: string;
}

export async function lipaNaMpesa(payload: StkPayload) {
  const res = await fetch("https://plugnpay.mwenaro.com/api/v1/payments?type=stk", {
    method: "POST",
    headers: {
      "Authorization": \`Bearer \${process.env.MWENARO_API_KEY}\`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error("Payment initiation failed");
  return await res.json();
}`}</code>
                      </pre>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="mt-8 space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Success Response (200 OK)</h4>
                  <Card className="bg-slate-100 border-none shadow-inner">
                    <CardContent className="p-4">
                      <pre className="text-xs text-slate-700 font-mono overflow-x-auto">
                        <code>{`{
  "success": true,
  "transactionId": "uuid-v4-string",
  "ResponseCode": "0",
  "ResponseDescription": "Success. Request accepted for processing.",
  "CheckoutRequestID": "ws_CO_1234567890",
  "CustomerMessage": "Success. Request accepted for processing."
}`}</code>
                      </pre>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Error Response (400 Bad Request)</h4>
                  <Card className="bg-red-50 border-red-100 shadow-inner">
                    <CardContent className="p-4">
                      <pre className="text-xs text-red-700 font-mono overflow-x-auto">
                        <code>{`{
  "error": "Missing required fields for STK Push",
  "status": 400
}`}</code>
                      </pre>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>

             {/* B2C & C2C Sections combined for brevity in example */}
             <section id="b2c" className="scroll-mt-12 space-y-6">
               <div className="flex items-center gap-3">
                 <Terminal className="h-6 w-6 text-indigo-600" />
                 <h2 className="text-2xl font-bold">B2C & C2C Transfers</h2>
               </div>
               <p className="text-gray-600 leading-relaxed gap-2">
                 Send money directly from your business till to a customer (<strong>B2C</strong>), or programmatically initiate a transfer between two customers (<strong>C2C</strong>).
               </p>

               <div className="grid md:grid-cols-2 gap-6">
                 <Card className="border-indigo-100 shadow-sm">
                   <CardHeader className="bg-indigo-50/50 pb-4">
                     <CardTitle className="text-base text-indigo-900">B2C Request Body</CardTitle>
                   </CardHeader>
                   <CardContent className="p-4 bg-slate-950">
                     <pre className="text-xs text-blue-400 font-mono overflow-x-auto">
                       <code>{`POST /v1/payments?type=b2c

{
  "b2cReceiver": "254712345678",
  "b2cAmount": 500,
  "b2cRemarks": "Driver Payout"
}`}</code>
                     </pre>
                   </CardContent>
                 </Card>

                 <Card className="border-indigo-100 shadow-sm">
                   <CardHeader className="bg-indigo-50/50 pb-4">
                     <CardTitle className="text-base text-indigo-900">C2C Request Body</CardTitle>
                   </CardHeader>
                   <CardContent className="p-4 bg-slate-950">
                     <pre className="text-xs text-purple-400 font-mono overflow-x-auto">
                       <code>{`POST /v1/payments?type=c2c

{
  "senderPhone": "254711111111",
  "receiverPhone": "254722222222",
  "c2cAmount": 1500,
  "c2cRemarks": "Peer Transfer"
}`}</code>
                     </pre>
                   </CardContent>
                 </Card>
               </div>
             </section>

            {/* Webhooks */}
            <section id="webhooks" className="scroll-mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <Webhook className="h-6 w-6 text-indigo-600" />
                <h2 className="text-2xl font-bold">Webhooks</h2>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Since mobile money payments are asynchronous, SafariCom will hit Mwenaro PlugPay when a real-world event occurs (e.g. the user enters their PIN). 
                PlugPay will then instantly POST a standardized JSON payload to your configured Webhook URL.
              </p>

              <div className="space-y-6">
                <Card className="bg-slate-950 border-none shadow-xl">
                  <CardHeader className="border-b border-slate-800 bg-slate-900/50">
                    <CardTitle className="text-sm font-mono text-slate-300">1. Successful Payment Event (payment.success)</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <pre className="text-sm text-green-400 font-mono overflow-x-auto">
                      <code>
{`POST https://your-domain.com/webhooks/mwenaro
Content-Type: application/json

{
  "event": "payment.success",
  "data": {
    "transactionId": "uuid-v4-from-initiation",
    "type": "STK_PUSH",
    "status": "SUCCESS",
    "amount": 1050,
    "phoneNumber": "254712345678",
    "mpesaReceiptNumber": "RJS8XQZZL9",
    "timestamp": "2026-03-21T10:30:00Z"
  }
}`}
                      </code>
                    </pre>
                  </CardContent>
                </Card>

                <Card className="bg-slate-950 border-none shadow-xl">
                  <CardHeader className="border-b border-slate-800 bg-slate-900/50">
                    <CardTitle className="text-sm font-mono text-slate-300">2. Customer Canceled Event (payment.cancelled)</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <pre className="text-sm text-yellow-400 font-mono overflow-x-auto">
                      <code>
{`POST https://your-domain.com/webhooks/mwenaro
Content-Type: application/json

{
  "event": "payment.cancelled",
  "data": {
    "transactionId": "uuid-v4-from-initiation",
    "type": "STK_PUSH",
    "status": "FAILED",
    "errorMessage": "Request cancelled by user",
    "timestamp": "2026-03-21T10:31:00Z"
  }
}`}
                      </code>
                    </pre>
                  </CardContent>
                </Card>

                <Card className="bg-slate-950 border-none shadow-xl">
                  <CardHeader className="border-b border-slate-800 bg-slate-900/50">
                    <CardTitle className="text-sm font-mono text-slate-300">3. Generic Failure / Timeout Event (payment.failed)</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <pre className="text-sm text-red-400 font-mono overflow-x-auto">
                      <code>
{`POST https://your-domain.com/webhooks/mwenaro
Content-Type: application/json

{
  "event": "payment.failed",
  "data": {
    "transactionId": "uuid-v4-from-initiation",
    "type": "STK_PUSH",
    "status": "FAILED",
    "errorMessage": "The balance is insufficient for the transaction",
    "timestamp": "2026-03-21T10:30:45Z"
  }
}`}
                      </code>
                    </pre>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-5">
                 <h4 className="font-semibold text-amber-900 mb-2">Security Tip</h4>
                 <p className="text-sm text-amber-800">
                    Always acknowledge receipt of a webhook with a <code className="font-bold bg-amber-100 px-1 rounded">200 OK</code> status.
                    If your server fails to respond, PlugPay will retry the delivery up to 5 times using exponential backoff.
                 </p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
