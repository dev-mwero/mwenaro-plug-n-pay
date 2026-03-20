"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "@/lib/actions/transactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity, 
  CreditCard, 
  CheckCircle2, 
  XCircle,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  const cards = [
    {
      title: "Total Volume",
      value: `KES ${(stats?.totalVolume || 0).toLocaleString()}`,
      description: "Total successful collections",
      icon: CreditCard,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Success Rate",
      value: `${stats?.totalTransactions ? ((stats.successCount / stats.totalTransactions) * 100).toFixed(1) : 0}%`,
      description: "Transaction completion rate",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      title: "Active Transactions",
      value: stats?.totalTransactions || 0,
      description: "Total requests processed",
      icon: Activity,
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      title: "Failed Requests",
      value: stats?.failureCount || 0,
      description: "Payment cancellations/errors",
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Track your M-Pesa business performance in real-time.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title} className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {card.title}
              </CardTitle>
              <div className={cn("p-2 rounded-lg", card.bg)}>
                <card.icon className={cn("h-4 w-4", card.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-gray-400 mt-1">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Revenue Growth</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.dailyVolume || []}>
                  <defs>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(val) => val.split('-').slice(1).join('/')}
                  />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(val) => `KES ${val}`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="volume" 
                    stroke="#10b981" 
                    fillOpacity={1} 
                    fill="url(#colorVolume)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-none shadow-sm flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Active Mode</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                   <Activity className="h-5 w-5" />
                </div>
                <div>
                   <h4 className="font-semibold text-emerald-900">Sandbox Environment</h4>
                   <p className="text-xs text-emerald-700">Currently receiving mock data</p>
                </div>
             </div>

             <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-gray-500">
                   <span>Verification Progress</span>
                   <span>85%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 w-[85%]" />
                </div>
                <p className="text-[10px] text-gray-400">Complete KYC to switch to Live Mode</p>
             </div>

             <Button className="w-full bg-gray-900 hover:bg-black text-white py-6 rounded-xl">
                Upgrade to Live Mode
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
