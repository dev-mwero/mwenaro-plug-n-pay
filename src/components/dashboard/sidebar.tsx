"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Key, 
  History, 
  Settings, 
  LogOut,
  ChevronRight,
  Smartphone
} from "lucide-react";
import { signOut } from "next-auth/react";

const sidebarLinks = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "API Simulator", href: "/dashboard/simulator", icon: Smartphone },
  { name: "API Keys", href: "/dashboard/keys", icon: Key },
  { name: "Transactions", href: "/dashboard/logs", icon: History },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 w-64 fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold text-emerald-600 tracking-tight">PlugPay</h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors group",
                isActive 
                  ? "bg-emerald-50 text-emerald-700" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <div className="flex items-center">
                <link.icon className={cn(
                  "mr-3 h-4 w-4",
                  isActive ? "text-emerald-500" : "text-gray-400 group-hover:text-gray-500"
                )} />
                {link.name}
              </div>
              {isActive && <ChevronRight className="h-4 w-4 text-emerald-300" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors group"
        >
          <LogOut className="mr-3 h-4 w-4 text-gray-400 group-hover:text-red-500" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
