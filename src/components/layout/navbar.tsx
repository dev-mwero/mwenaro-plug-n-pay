import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export function NavBar() {
  return (
    <header className="px-6 lg:px-12 h-20 flex items-center justify-between sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-100">
      <Link className="flex items-center justify-center space-x-2" href="/">
        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
          <Zap className="h-5 w-5 text-white fill-current" />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900">PlugPay</span>
      </Link>
      <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
        <Link className="hover:text-emerald-600 transition-colors" href="/#features">Features</Link>
        <Link className="hover:text-emerald-600 transition-colors" href="/docs">Documentation</Link>
        <Link className="hover:text-emerald-600 transition-colors" href="/dashboard">Dashboard</Link>
      </nav>
      <div className="flex items-center gap-2 sm:gap-4">
        <Link href="/login" className="hidden sm:block">
          <Button variant="ghost" className="text-sm font-medium">Log in</Button>
        </Link>
        <Link href="/login">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200/50 px-4 sm:px-6 font-semibold text-sm">
            Get Started
          </Button>
        </Link>
      </div>
    </header>
  );
}
