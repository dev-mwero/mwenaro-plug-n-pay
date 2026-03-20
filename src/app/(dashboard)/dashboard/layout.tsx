import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="pl-64">
        <header className="h-16 border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-500">
            Welcome back, <span className="text-gray-900">{session.user?.name || session.user?.email}</span>
          </h2>
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
              {session.user?.email?.[0].toUpperCase()}
            </div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
