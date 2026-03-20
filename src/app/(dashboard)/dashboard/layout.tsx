"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (status === "loading") return null;
  if (status === "unauthenticated") redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <DashboardSidebar 
        className="hidden md:flex w-64 fixed left-0 top-0 border-r border-gray-200" 
      />

      {/* Mobile Sidebar Overlay */}
      <div className={cn(
        "fixed inset-0 z-50 bg-black/50 transition-opacity md:hidden",
        isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )} onClick={() => setIsSidebarOpen(false)} />

      {/* Mobile Sidebar Drawer */}
      <DashboardSidebar 
        onClose={() => setIsSidebarOpen(false)}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform md:hidden border-r border-gray-200",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )} 
      />

      <div className="flex-1 flex flex-col min-w-0 md:pl-64">
        <header className="h-16 border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-10 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h2 className="text-sm font-semibold text-gray-500 truncate">
              Welcome back, <span className="text-gray-900">{session?.user?.name || session?.user?.email}</span>
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs shrink-0">
              {session?.user?.email?.[0].toUpperCase()}
            </div>
          </div>
        </header>
        <div className="p-4 md:p-8 overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
